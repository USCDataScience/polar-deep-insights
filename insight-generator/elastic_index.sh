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

#!/bin/bash
#!usr/bin/env python .

source env.sh

# Delete old index if exists
curl -XDELETE 'localhost:9200/insight-generator'

# create ElasticSearch index
curl -XPOST 'http://localhost:9200/insight-generator'

# create mapping
curl -XPOST 'http://localhost:9200/insight-generator/docs/_mapping' -d '@di-mapping-schema.json'

# get the indices
curl 'localhost:9200/_cat/indices?v'

DIRECTORY="out"

if [ -d $DIRECTORY ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  rm -rf $DIRECTORY
fi
mkdir $DIRECTORY
python extract.py sparkler_data.json $DIRECTORY/output error

cd $DIRECTORY

# uploading Insight-generator output onto ElasticSearch index 
find . -name "*.json"|while read fname; do
  echo "$fname"
  curl -X POST 'http://localhost:9200/insight-generator/docs' -d @$fname
done
