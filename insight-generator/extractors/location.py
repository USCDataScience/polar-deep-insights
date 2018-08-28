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

GEO_TOPIC_ENDPOINT = os.environ["GEO_TOPIC_ENDPOINT"] + "/api/search?"

class GeoTopicExtractor(Extractor):

  def extract(self, content):
    self.locationCount = self.extraction.count("LOCATION")
    self.locationCountHash = reduce(lambda m, l: m.update({ l['name'] : l }) or m, self.locationCount, { })
    locations = self.locationCountHash.keys()

    try:
      if len(locations) > 0:
        self.params = "&".join(map(lambda l: "s={0}".format(self.modules['urllib'].quote(l)), locations))
        self.response = self.modules['urllib2'].urlopen(GEO_TOPIC_ENDPOINT + self.params).read()
        self.info = self.modules['json'].loads(self.response)
        extractedLocations = self.getLocations()
        extractedGeoInfo = self.getInfo()
      else:
        extractedLocations = [ ]
        extractedGeoInfo   = [ ]
    except:
      extractedLocations = [ ]
      extractedGeoInfo   = [ ]

    self.extraction.accumulate("geo", extractedLocations)
    self.extraction.accumulate("locations", extractedGeoInfo)

    return self.extraction

  def formatInfo(self, l, rawText):
    return {
     'name': l[0]['name'],
     'rawText': rawText,
     'count': self.locationCountHash[ rawText ]["count"],
     'tf' : self.locationCountHash[ rawText ]["tf"],
     'tf-alpha': self.locationCountHash[ rawText ]["tf-alpha"],
     'countryCode': l[0]['countryCode'],
     'location': {
        'lat': l[0]['latitude'],
        'lon': l[0]['longitude']
     },
     'admin1Code': l[0]['admin1Code'],
     'admin2Code': l[0]['admin2Code']
    }

  def getInfo(self):
    return map(lambda k: self.formatInfo(self.info[k], k), self.info)

  def getLocations(self):
    return map(lambda k: self.formatInfo(self.info[k], k)["location"], self.info)
