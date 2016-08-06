import redis
import hashlib


PREFIX = "polar-"

class DocumentIdentifier:
  def __init__(self):
    self.client = redis.StrictRedis(host='localhost', port=6379, db=0)

  def key(self, path):
    return hashlib.md5(path.encode("utf")).hexdigest()[ 0 : 15 ]

  def set(self, path):
    key = self.key(path)
    self.client.set(PREFIX + key, path)
    return key

  def get(self, key):
    self.client.get(PREFIX + key)
