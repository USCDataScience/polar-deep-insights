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

class StatExtractor(Extractor):
  def __init__(self, extraction, modules):
    super(StatExtractor, self).__init__(extraction, modules)

  def extract(self, content):
    d = { }
    path = self.extraction.data["path"]

    d["file-size"] = self.modules["os"].stat(path).st_size
    d["extracted-text-size"] = self.modules["sys"].getsizeof( self.extraction.data["content"] )

    d["information-extracted"] = float(d["extracted-text-size"]) / d["file-size"]
    d["information-lost"] = ( 1 - d["information-extracted"] )

    d["metadata-size"] = self.modules["sys"].getsizeof( self.extraction.data["metadata"] )
    d["metadata-file-size-ratio"] = float(d["metadata-size"]) / d["file-size"]

    self.extraction.data["stat"] = d

    return self.extraction
