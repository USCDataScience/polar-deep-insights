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
ENDPOINT = os.environ["REDIS_ENDPOINT"]
PREFIX = "polar-"

class DocumentIdentifier:
  def __init__(self, modules):

    self.modules = modules

    self.client = self.modules["redis"].StrictRedis(host=ENDPOINT, port=6379, db=0)

  def key(self, path):
    return self.modules["hashlib"].md5(path.encode("utf")).hexdigest()[ 0 : 15 ]

  def set(self, path):
    key = self.key(path)
    self.client.set(PREFIX + key, path)
    return key

  def get(self, key):
    self.client.get(PREFIX + key)
