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

#! /bin/bash

DIRECTORY="requirements"

if [ ! -d $DIRECTORY ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  mkdir $DIRECTORY
fi

cd $DIRECTORY

# Elasticsearch
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.3.0.zip
unzip elasticsearch-6.3.0.zip

# Stanford-ner
wget https://nlp.stanford.edu/software/stanford-ner-2018-02-27.zip

unzip stanford-ner-2018-02-27.zip

# Geo-topic-parser
git clone https://github.com/chrismattmann/lucene-geo-gazetteer.git

# Grobid - required for Grobid Quantities
git clone https://github.com/kermitt2/grobid.git

cd grobid 

# Grobid Quantities
git clone https://github.com/kermitt2/grobid-quantities.git
