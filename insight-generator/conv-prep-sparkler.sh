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

# Download Sparkler data from Solr
curl -L "http://localhost:8983/solr/crawldb/select?fl=extracted_text,%20id&fq=status:FETCHED&indent=off&q=*:*&rows=100" > sparkler_rawdata.json

# Parse Sparkler data to the format required by insight-generator
python parse.py sparkler_rawdata.json sparkler_data.json
