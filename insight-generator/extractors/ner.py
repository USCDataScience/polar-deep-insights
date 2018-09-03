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

from base import Extractor

class NERExtractor(Extractor):
  def __init__(self, extraction, modules):
    super(NERExtractor, self).__init__(extraction, modules)

  def _noramlizeDates(self):
    def toF(d):
      try:
        return float(d)
      except Exception as e:
        return 0

    if 'DATE' in self.extraction.data:
      self.extraction.data['DATE'] = reduce(lambda m,d: m + self.modules["re"].compile(r'\d{4}').findall(d) if len(d) > 4 else m + [ d ], self.extraction.data['DATE'], [ ])
      self.extraction.data['DATE'] = map(toF, self.extraction.data['DATE'])
      self.extraction.data['DATE'] = filter(lambda d: d!=0, self.extraction.data['DATE'])

  def extract(self, content):
    cleanContent = content.encode('ascii',errors='ignore')
    tags = self.modules["tagger"].tag(self.wordTokenize(cleanContent))
    iterator = 0

    while iterator < len(tags):
      if tags[iterator][1] != 'O':
        j = 1
        while iterator + j < len(tags) and tags[iterator][1] == tags[iterator + j][1]:
          j = j + 1

        chunks = map(lambda x: x[0], tags[iterator:iterator+j])
        entity = " ".join(chunks)

        self.extraction.accumulate(tags[iterator][1], [ entity ])

        iterator = iterator + j
      else:
        iterator = iterator + 1

    self._noramlizeDates()

    return self.extraction

