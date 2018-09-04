# encoding: utf-8
#!/usr/bin/env python 
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

import json
import sys
import os
from os.path import join

DIR = sys.argv[1]
OUTFILE = sys.argv[2]

groupCounts = {}
unGroupedCounts = {}
rawToGroupMap = {}

for root, dirs, files in os.walk(DIR):
    for f in files:
        filename = join(root, f)
        print "Processing file: ["+filename+"]"
        with open(filename, 'r') as jf:
            jsonDoc = json.load(jf)
            if "measurements" in jsonDoc:
                for m in jsonDoc["measurements"]:
                    if "rawUnit" in m:
                        rawUnitName = m["rawUnit"]["name"]
                        if rawUnitName in groupCounts:
                            rawCount = groupCounts[rawUnitName]
                            rawCount = rawCount + 1
                        else:
                            rawCount = 1

                        groupCounts[rawUnitName] = rawCount

                        if "type" in m:
                            rawToGroupMap[rawUnitName] = m["type"]
                            
                    elif "parsedValue" in m:
                        parsedValue = m["parsedValue"]
                        if parsedValue in unGroupedCounts:
                            ugCount = unGroupedCounts[parsedValue]
                            ugCount = ugCount + 1
                        else:
                            ugCount = 1

                        unGroupedCounts[parsedValue] = ugCount
                            

measurementsDoc = []
keyIdx = 0
for m in groupCounts.keys():
    print "Measurement "+m
    if m in rawToGroupMap:
        measurementsDoc.append({ "name" : m, "count" : groupCounts[m], "group" : rawToGroupMap[m]})
    else:
        measurementsDoc.append({ "name" : m, "count" : groupCounts[m], "$$hashKey" : "object:"+str(keyIdx)})
        keyIdx = keyIdx + 1

keyIdx = 0
for m in unGroupedCounts:
    measurementsDoc.append({ "name" : m, "count" : unGroupedCounts[m], "$$hashKey" : "object:"+str(keyIdx)})
    keyIdx = keyIdx + 1

measurementsDoc = { "measurements" : measurementsDoc }
with open(OUTFILE, 'w') as oFile:
    oFile.write(json.dumps(measurementsDoc))
