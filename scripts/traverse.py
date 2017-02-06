from os import listdir, mkdir
from os.path import isfile, join, isdir
from shutil import copyfile
from tika import detector
from shutil import move

import ntpath
import re
import sys
import time

import sys, traceback

MOUNT_POINT = sys.argv[1]
log = sys.argv[2]
err = sys.argv[3]

def write(log, c):
  f = open(log, "a")
  f.write(c)
  f.close()

def safeMakeDir(path):
  if not isdir(path):
    mkdir(path)

def fetchFile(path):
  write(log, "{0}\n".format(path[len(MOUNT_POINT):]))

def dfs_traversal(path):
  if isfile(path):
    fetchFile(path)
    return

  for f in listdir(path):
    try:
      dfs_traversal(join(path, f))
    except Exception as e:
      write(err, path + "\n" )

if __name__ == '__main__':
  MOUNT_POINT = sys.argv[1]

  dfs_traversal(MOUNT_POINT)
