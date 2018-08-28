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

# TODO: Remove hard coded file path
ENTITY_FILE_PATH = "./data/entities.txt"

class EntityExtractor(Extractor):
  def __init__(self, extraction, modules):
    super(EntityExtractor, self).__init__(extraction, modules)
    self.entityFile = open(ENTITY_FILE_PATH)

  def generateExp(self):
    entities = [ e.strip() for e in self.entityFile ]
    regStr = r"\b({0})\b".format( "|".join( entities ) )
    return self.modules["re"].compile( regStr )

  def extract(self, content):
    entityExp = self.generateExp()
    map(lambda l: self.extraction.accumulate("entities", entityExp.findall(l)), self.sentTokenize(content))

    return self.extraction
