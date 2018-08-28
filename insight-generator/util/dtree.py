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

from os import listdir
from os.path import isfile, join

import sys, traceback

class DirTreeTraverser:
  def __init__(self, path):
    self.path = path

  def traverse(self, process, sPath=None):
    if not sPath:
      sPath = self.path

    # Process file
    if isfile(sPath):
      process(sPath)
      return

    for f in listdir(sPath):
      try:
        self.traverse(process, join(sPath, f))
      except Exception as e:
        print e
        traceback.print_exc(file=sys.stdout)
