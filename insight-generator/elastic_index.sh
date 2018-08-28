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

JSON_LINE_DATA_FILE="$1"

# Delete old index if exists
curl -XDELETE "$ES_URL/insight-generator"

# create ElasticSearch index
curl -XPOST "$ES_URL/insight-generator"

# create mapping
echo "Creating ES mapping....."
curl -XPOST "$ES_URL/insight-generator/docs/_mapping" -d @'di-mapping-schema.json'

# get the indices
curl "$ES_URL/_cat/indices?v"

DIRECTORY="out"

if [ -d $DIRECTORY ]; then
  # Control will enter here if $DIRECTORY exists.
  rm -rf $DIRECTORY
fi

# Make output directory
mkdir $DIRECTORY

# Run extract.py script on the output files
python extract.py $JSON_LINE_DATA_FILE $DIRECTORY/output error

# Change to output directory
pushd $DIRECTORY

# uploading Insight-generator output onto ElasticSearch index 
find . -name "*.json"|while read fname; do
  echo "$fname"
  curl -X POST "$ES_URL/insight-generator/docs" -d @"$fname"
done

popd
