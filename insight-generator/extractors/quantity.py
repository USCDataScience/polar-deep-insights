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


import os
from base import Extractor
ENDPOINT = os.environ["GROBID_QUANTITY_ENDPOINT"] + "/processQuantityText"

class QuantityExtractor(Extractor):
  def extract(self, content):
    
    cleanContent = content.encode('ascii',errors='ignore')
    try:
      request = self.modules["requests"].post(ENDPOINT, timeout=30, data=dict(text=cleanContent))
      measurements = self.modules["json"].loads(request.content)['measurements']
      extMeasurements = reduce(self.extractMeasurement, measurements, [ ])
    except Exception as e:
      print("Exception parsing measurements! content: ["+cleanContent+"]")
      print(e)
      extMeasurements = [ ]

    self.extraction.accumulate("measurements", extMeasurements)
    return self.extraction

  def extractValue(self, q):
    q['parsedValue'] = float(q['parsedValue'])
    return q

  def extractRange(self, m):
    res = []

    if 'quantityLeast' in m:
      res.append(self.extractValue(m['quantityLeast']))

    if 'quantityMost' in m:
      res.append(self.extractValue(m['quantityMost']))

    return res

  def extractMeasurement(self, acc, m):
    if m["type"] == 'value' and 'quantity' in m:
      return acc + [ self.extractValue(m['quantity']) ]
    elif m['type'] == 'interval':
      return acc + self.extractRange(m)
    else:
      return acc
