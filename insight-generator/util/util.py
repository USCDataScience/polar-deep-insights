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

import random, string, os, codecs

class TmpFile:
  def __init__(self, extension=""):
    self.path = os.path.join('/tmp', ''.join(random.sample(string.lowercase+string.digits, 5))) + extension

  def write(self, content):
    fw = codecs.open(self.path, 'w+', encoding='utf8')
    fw.write(content)
    fw.close()

  def read(self):
    return open(self.path).read()

  def destroy(self):
    if self.path and os.path.exists(self.path):
      os.remove(self.path)

  def __exit__(self, exc_type, exc_value, traceback):
    self.destroy()
