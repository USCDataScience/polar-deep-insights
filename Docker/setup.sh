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

mkdir data
cd data
mkdir polar
cd polar

# Place the mappings and data file in polar folder
# Place the input inside files folder if you need to give pdf input
# Place the Sparkler input from Solr index inside sparkler/raw folder. Name the file sparkler_data.json 
# Place the Sparkler input after running parse.py on it inside sparkler/parsed folder. Name the file sparkler_rawdata.json
# Create an empty file called ingest_data.json inside ingest folder

mkdir files ingest sparkler
cd sparkler 
mkdir raw parsed
cd raw
> sparkler_rawdata.json
cd ../parsed
> sparkler_data.json
