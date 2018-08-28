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

import shlex
from subprocess import call
import speech_recognition as sr

class ContentExtractor:
  def __init__(self, path, modules):
    self.__modules = modules
    self.path = path

  def extract(self, include_metadata=False):
    parsed   = self.__modules["TikaWrapper"](self.path, self.__modules).get()
    content  = self.__modules["TikaWrapper"](parsed["content"], self.__modules, raw=True).getTRR()

    self.content_type = parsed["metadata"]["Content-Type"]

    if self.isExtractableImage():
      c = self.imageObjectExtractor()
      if c != "":
        content = c + content
        parsed["metadata"]["mm-text"] = c

    if self.isExtractableAudio():
      c = self.audioSpeechExtractor()
      if c != "":
        content = c + content
        parsed["metadata"]["mm-text"] = c

        # Deleting unnecessary fields
        if "Red TRC" in parsed["metadata"]:
          del parsed["metadata"]["Red TRC"]
        if "Green TRC" in parsed["metadata"]:
          del parsed["metadata"]["Green TRC"]
        if "Blue TRC" in parsed["metadata"]:
          del parsed["metadata"]["Blue TRC"]

    def safeStringify(d):
      if(type(d) ==  type([ ])):
        return "\n".join( map(safeStringify, d) )

      if isinstance(d, unicode):
        return d.encode('UTF-8')

      return str(d)


    if include_metadata:
      md_string = "\n".join( map(safeStringify, parsed["metadata"].values() ) )
      content = md_string.decode('UTF-8') + "\n" + content

    return (content, parsed["metadata"])

  def isExtractableImage(self):
    return self.content_type == "image/jpeg"

  def isExtractableAudio(self):
    return self.content_type[0:5] == "audio"

  def audioSpeechExtractor(self):
    try:
      tmp = self.__modules["TmpFile"](extension=".flac")
      call(shlex.split("ffmpeg -i {0} -c:a flac {1}".format(self.path, tmp.path)))
      r = sr.Recognizer()
      with sr.AudioFile(tmp.path) as source:
        audio = r.record(source)
      d = r.recognize_sphinx(audio)
      tmp.destroy()
    except Exception as e:
      print "Speech conversion error {0}".format(e)
      d = ""

    return d

  def imageObjectExtractor(self):
    try:
      d = self.__modules["TikaWrapper"](self.path, self.__modules).getImageObjects()
    except Exception as e:
      print "Image object extraction error {0}".format(e)
      d = [ ]

    return "\n".join( d )




