#! /usr/bin/env bash

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

export REDIS_ENDPOINT=localhost
export TIKA_PATH=http://localhost:9998
export GROBID_QUANTITY_ENDPOINT=http://localhost:8060
export GEO_TOPIC_ENDPOINT=http://localhost:8765
export CLASSPATH=/Users/prerana/Desktop/polar-deep-insights/insight-generator/requirements/stanford-ner-2018-02-27/stanford-ner.jar
export STANDFORD_NER_MODEL_PATH=/Users/prerana/Desktop/polar-deep-insights/insight-generator/requirements/stanford-ner-2018-02-27/classifiers/english.muc.7class.distsim.crf.ser.gz
echo "Done!!"
