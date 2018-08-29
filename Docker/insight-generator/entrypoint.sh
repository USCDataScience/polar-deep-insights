#!/bin/bash
# encoding: utf-8
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

PDI_JSON_PATH=/data/polar

mkdir -p /deploy/requirements/logs/
touch /deploy/requirements/logs/pdi-generator.log
touch /deploy/requirements/logs/pdi-ingest.log

WAIT_COMMAND='[ $(curl --write-out %{http_code} --silent --output /dev/null http://polar-deep-insights/elasticsearch/_cat/health?h=st) = 200 ]'
WAIT_LOOPS=30
WAIT_SLEEP=2

is_ready() {
    eval "$WAIT_COMMAND"
}

# wait until is ready
i=0
while ! is_ready; do
    i=`expr $i + 1`
    if [ $i -ge $WAIT_LOOPS ]; then
        echo "$(date) - Elasticsearch still not ready, giving up"
        exit 1
    fi
    echo "$(date) - waiting for Elasticsearch to be ready"
    sleep $WAIT_SLEEP
done

echo "Starting Grobid Quantities"
cd /deploy/requirements/grobid/grobid-quantities && \
    mvn -Dmaven.test.skip=true jetty:run-war >> /deploy/requirements/logs/pdi-generator.log 2>&1&

echo "Starting Tika Server"
cd /deploy/requirements/tika-server && \
    java -jar tika-server-1.15-SNAPSHOT.jar >> /deploy/requirements/logs/pdi-generator.log 2>&1&

echo "Starting Lucene Geo Gazetteer Server"
cd /deploy/requirements/lucene-geo-gazetteer && \
    lucene-geo-gazetteer -server >> /deploy/requirements/logs/pdi-generator.log 2>&1&

if [[ ! -z "${PDI_JSON_PATH}" ]]; then

    if [ -f "$PDI_JSON_PATH/sparkler/raw/sparkler_rawdata.json" ]; then
	echo "Raw sparkler data provided in $PDI_JSON_PATH/sparkler/raw....parsing."
	echo "Removing prior ingest data from $PDI_JSON_PATH/ingest/ingest_data.json"
	rm -rf $PDI_JSON_PATH/ingest/ingest_data.json;
	pushd $PDI_HOME/insight-generator/;
	python parse.py $PDI_JSON_PATH/sparkler/raw/sparkler_rawdata.json $PDI_JSON_PATH/ingest/ingest_data.json >> /deploy/requirements/logs/pdi-ingest.log 2>&1 ;
	popd
	INGEST=1
    elif [ -f "$PDI_JSON_PATH/sparkler/parsed/sparkler_data.json" ]; then
	echo "Parsed sparkler data provided in $PDI_JSON_PATH/sparkler/parsed...preparing to ingest."
	cp $PDI_JSON_PATH/sparkler/parsed/sparkler_data.json $PDI_JSON_PATH/ingest/ingest_data.json;
	INGEST=1
    elif [ -d "$PDI_JSON_PATH/files" ]; then
	echo "Removing prior ingest data from $PDI_JSON_PATH/ingest/ingest_data.json"
	rm -rf $PDI_JSON_PATH/ingest/ingest_data.json;
	echo "Calling Apache Tika and prepping JSONs on $PDI_JSON_PATH/files: outputting to $PDI_JSON_PATH/ingest"
	pushd $PDI_HOME/insight-generator/;
	python tika-prepare.py $PDI_JSON_PATH/files $PDI_JSON_PATH/ingest >> /deploy/requirements/logs/pdi-ingest.log 2>&1 ;
	popd
	INGEST=1
    fi

    if [[ ! -z "${INGEST}" ]]; then
	echo "Using ES URL $ES_URL for ingestion."
	pushd $PDI_HOME/insight-generator/;
	./elastic_index.sh $PDI_JSON_PATH/ingest/ingest_data.json >> /deploy/requirements/logs/pdi-ingest.log 2>&1&
	popd
    fi

fi


# watch log
echo "Watching pdi-generator log and pdi-ingest log...."
tail -f /deploy/requirements/logs/pdi-generator.log /deploy/requirements/logs/pdi-ingest.log 