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

class Extraction:
  def __init__(self):
    self.data = { }
    self.extracted_features = ["DATE","entities","LOCATION","PERSON","ORGANIZATION","MONEY","PERCENT","TIME","locations"]

  def get(self, k):
    if k in self.data:
      return self.data[k]

  def accumulate(self, entity, d):
    if not entity in self.data:
      self.data[entity] = [ ]

    self.data[entity] = self.data[entity] + d

  def getData(self, id, crawlHash={}):
    d = {
      "dates"        : self.count("DATE"),
      "entities"     : self.count("entities"),
      "places"       : self.count("LOCATION"),
      "people"       : self.count("PERSON"),
      "organizations": self.count("ORGANIZATION"),
      "money"        : self.count("MONEY"),
      "percentages"  : self.count("PERCENT"),
      "time"         : self.count("TIME"),
      "locations"    : self.get("locations"),
      "geo"          : self.get("geo"),
      "measurements" : self.get("measurements"),
      "metadata"     : self.get("metadata"),
      "stat"         : self.get("stat"),
    }
    d["id"] = id
    d["crawl-hash"] = crawlHash
    d["mime-type"] = d["metadata"]["Content-Type"]

    for e in ["entities", "dates", "time", "places", "organizations", "percentages", "money", "people", "locations"]:
      d[e + "-occuranceCount"] = sum(map(lambda x: x["count"], d[e]))
      d[e + "-typeCount"]      = len(d[e])

    return d

  def countHash(self, key):
    d = self.get(key)

    if not d:
      return { }

    return reduce(lambda m,e: m.update({ e: ( 1 if e not in m else m[e] + 1 ) }) or m, d, { })


  def entityTotals(self, h):
    cTotal = sum(h.values())
    eTotal = len(h.keys())
    return (cTotal, eTotal)

  def count(self, key):
    d = self.countHash(key)
    (cTotal, eTotal) = self.entityTotals(d)
    return map(lambda entity: { 'name': entity, 'count': d[entity], 'tf': (float(d[entity]) / cTotal), 'tf-alpha': (float(1) / eTotal)  }, d.keys())
