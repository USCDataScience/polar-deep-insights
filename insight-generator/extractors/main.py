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

class InformationExtractor:
  def __init__(self, extractors, ContentExtractor, modules):
    self.__modules = modules
    self.extractors = extractors
    self.ContentExtractor = ContentExtractor


  def extract(self, extraction, path, include_metadata=False):
    (content, metadata) = self.ContentExtractor(path, self.__modules).extract(include_metadata)

    extraction.data["metadata"] = metadata
    extraction.data["content"]  = content
    extraction.data["path"]     = path

    return reduce(lambda extraction, Extractor: Extractor(extraction, self.__modules).extract(content), self.extractors, extraction)
