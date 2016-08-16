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
