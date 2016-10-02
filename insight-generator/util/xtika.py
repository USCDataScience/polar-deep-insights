TIKA_SERVER = 'http://localhost:9998'
from tika.tika import callServer
import random, string, os

class TikaWrapper:
  def __init__(self, file, modules, raw=False):
    if raw:
      self.buffer = os.path.join('/tmp', ''.join(random.sample(string.lowercase+string.digits, 5)))
      self.file = self.buffer
      open(self.buffer, "w+").write(file.encode("utf-8"))
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

  def getTRR(self):
    return self.__call({ 'Content-Type': 'application/tag-ratio' })['metadata']['trr-extracted']

  def getImageObjects(self):
    return self.__call({ 'Content-Type': 'application/image-object' })['metadata']['OBJECT']

  def __del__(self):
    if self.buffer and self.modules["os"].path.exists(self.buffer):
      self.modules["os"].remove(self.buffer)
