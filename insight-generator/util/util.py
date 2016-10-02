import random, string, os

class TmpFile:
  def __init__(self, extension=""):
    self.path = os.path.join('/tmp', ''.join(random.sample(string.lowercase+string.digits, 5))) + extension

  def destroy(self):
    if self.path and os.path.exists(self.path):
      os.remove(self.path)
