# Required modules
# tika-parser: from tika import parser

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
      HOUNDIFY_CLIENT_ID = "r0m3MxqkxG_r5fKQOt6qaw=="
      HOUNDIFY_CLIENT_KEY = "u2s0qH3kHm8jAntPSf46ISe87JUvUwaAi03iJYcsXTyiXISDom825P1sEVW-6gU8q3td8Coe5dWFQXN3TGdf0Q=="
      d = r.recognize_houndify(audio, client_id=HOUNDIFY_CLIENT_ID, client_key=HOUNDIFY_CLIENT_KEY)
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




