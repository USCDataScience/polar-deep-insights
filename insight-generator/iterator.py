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

import sys, re, nltk, os, json, requests, urllib, urllib2, traceback, shutil
import redis, hashlib

from tika     import parser
from nltk.tag import StanfordNERTagger

from extractors.entity      import EntityExtractor
from extractors.location    import GeoTopicExtractor
from extractors.quantity    import QuantityExtractor
from extractors.ner         import NERExtractor
from extractors.extraction  import Extraction
from extractors.content     import ContentExtractor
from extractors.stat        import StatExtractor

from extractors.main import InformationExtractor

from util.doi           import DocumentIdentifier
from util.xtika         import TikaWrapper
from util.util          import TmpFile

PATH          = sys.argv[1]
OUTPUT_PATH   = sys.argv[2]
PREFIX        = sys.argv[3]
ERROR_PATH    = sys.argv[4]
MIN_SIZE      = int(sys.argv[5])

tagger = StanfordNERTagger(os.environ["STANDFORD_NER_MODEL_PATH"])

extractors = [
  EntityExtractor,
  NERExtractor,
  # QuantityExtractor,
  GeoTopicExtractor,
  StatExtractor,
]

dependencies = {
  "sys": sys,
  "os": os,
  "re": re,
  "nltk": nltk,
  "tagger": tagger,
  "tika-parser": parser,
  "TikaWrapper" : TikaWrapper,
  "requests" : requests,
  "json" : json,
  "urllib" : urllib,
  "urllib2" :urllib2,
  "TmpFile": TmpFile,
}

metaExtractor = InformationExtractor(extractors, ContentExtractor, dependencies)

idf = DocumentIdentifier({
  "redis": redis,
  "hashlib": hashlib,
})

def persistExtraction(d):
  f = open(OUTPUT_PATH, "a")
  f.write(json.dumps(d))
  f.write("\n")
  f.close()

def process(path, ab):
  if os.path.getsize(path) > MIN_SIZE:
    try:
      d = metaExtractor.extract(Extraction(), path, include_metadata=True).getData(idf.set(ab))
      persistExtraction(d)
    except:
      e = open(ERROR_PATH, "a")
      e.write("ERROR: " + ab + "\n")
      traceback.print_exc(file=e)
      e.close()

i = open(PATH, "r")
for p in i:
  t = TmpFile()
  path = p.strip('\n').split(',')[ 0 ]
  print path
  shutil.copyfile(PREFIX + path, t.path)
  process(t.path, path)
  t.destroy()
i.close()

