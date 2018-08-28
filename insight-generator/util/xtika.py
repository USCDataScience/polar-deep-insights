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

from tika.tika import callServer
import os

TIKA_SERVER = os.environ["TIKA_PATH"]
class TikaWrapper:
  def __init__(self, file, modules, raw=False):
    if raw:
      self.buffer = modules["TmpFile"]()
      self.file = self.buffer.path
      open(self.buffer.path, "w+").write(file.encode("utf-8"))
    else:
      self.file = file
      self.buffer = None

    self.modules = modules

  def __call(self, params={}):
    (status, response) = callServer('put', TIKA_SERVER, '/rmeta', open(self.file),  params)

    if status != 200:
      raise "Tika Parse Exception"

    d = self.modules["json"].loads(response)[0]

    if 'X-TIKA:content' in d:
      content = d.pop('X-TIKA:content')
    else:
      content = ''

    return {
      'metadata': d,
      'content' : content
    }

  def get(self):
    return self.__call()

  def getInsights(self):
    return self.__call({ 'Content-Type': 'application/text-insight' })['metadata']

  def getTRR(self):
    return self.__call({ 'Content-Type': 'application/tag-ratio' })['metadata']['trr-extracted']

  def getImageObjects(self):
    return self.__call({ 'Content-Type': 'application/image-object' })['metadata']['OBJECT']

  def __del__(self):
    if self.buffer:
      self.buffer.destroy()
