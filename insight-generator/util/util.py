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
