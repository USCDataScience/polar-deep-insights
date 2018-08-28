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

SPARKLER_JSON_PATH=/data/polar

mkdir -p /deploy/requirements/logs/
touch /deploy/requirements/logs/pdi-generator.log

echo "Starting Apache2 (HTTPD)"
sudo apachectl start

echo "Starting Grobid Quantities"
cd /deploy/requirements/grobid/grobid-quantities && \
    mvn -Dmaven.test.skip=true jetty:run-war >> /deploy/requirements/pdi-generator.log 2>&1&

echo "Starting Tika Server"
cd /deploy/requirements/tika-server && \
    java -jar tika-server-1.15-SNAPSHOT.jar >> /deploy/requirements/pdi-generator.log 2>&1&

echo "Starting Lucene Geo Gazetteer Server"
cd /deploy/requirements/lucene-geo-gazetteer && \
    lucene-geo-gazetteer -server >> /deploy/requirements/pdi-generator.log 2>&1&


if [ -d "$SPARKLER_JSON_PATH/sparkler.json" && -d "$ES_URL" ]; then
    echo "Using SPARKLER JSON and loading into Elasticsearch: [$ES_URL]: JSON path: $SPARKLER_JSON_PATH/sparkler.json"
    # add command here

fi

# watch log
echo "Watching pdi-generator log...."
tail -f /deploy/requirements/pdi-generator.log