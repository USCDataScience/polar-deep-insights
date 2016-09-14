TIKA_SERVER = 'http://localhost:9998'

import json
from tika.tika import callServer

class TikaWrapper:
  def __init__(self, content, modules):
    open("buffer", "w+").write(content)
    self.buffer = "buffer"
    self.file = file
    self.modules = modules

  def __call(self, params):
    (status, response) = self.modules["tika-server-request-fn"]('put', TIKA_SERVER, '/rmeta', open(self.buffer),  params)

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

  def getTRR(self):
    return self.__call({ 'Content-Type': 'application/tag-ratio' })['metadata']['trr-extracted']

  def __del__(self):
    if self.modules["os"].path.exists(self.buffer):
      self.modules["os"].remove(self.buffer)
