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

import sys, re, nltk, os, json, requests, urllib, urllib2, traceback

PATH          = sys.argv[1]
OUTPUT_PATH   = sys.argv[2]

for l in open(PATH):
	l = l[l.index('"docs":['):]
	l1 = l.replace('"docs":[','').replace('},','}\n').replace('}]}}','}').replace('""','"no data"')
	f = open(OUTPUT_PATH, "w")
	f.write(l1)
f.close()
