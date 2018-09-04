#!/bin/bash
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

PDI_JSON_PATH="$1"

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
	python ./measurement-index.py ./out/ ./measurement-index.json >> /deploy/requirements/logs/pdi-ingest.log 2>&1&
	./measurement-ingest.sh ./measurement-index.json >> /deploy/requirements/logs/pdi-ingest.log 2>&1&
	popd
    fi

fi