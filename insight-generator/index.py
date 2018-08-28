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

import sys, elasticsearch, json
from util.elastic import ESIndex

PATH        = sys.argv[1]
HOST        = sys.argv[2]
INDEX       = sys.argv[3]
DTYPE       = sys.argv[4]

es = ESIndex(HOST, INDEX, DTYPE, {
  "elasticsearch" : elasticsearch
})

f = open(PATH, "r")
lineNumber = 0

for line in f:
  lineNumber = lineNumber + 1
  try:
    d = json.loads(line.strip('\n'))
    del d['crawl-hash']['outlinks']
    print " INDEXING : " + d["id"] + " LINE NUMBER : " + str(lineNumber)
    es.write(d)
  except Exception as e:
    print e
    print >> sys.stderr, str(lineNumber)

f.close()

print "SUCCESSFULLY INDEXED ALL DOCUMETNS"
