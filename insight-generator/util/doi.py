import os
ENDPOINT = os.environ["REDIS_ENDPOINT"]
PREFIX = "polar-"
# expects modules {
#   "redis": redis,
#   "hashlib": hashlib,
# }
class DocumentIdentifier:
  def __init__(self, modules):

    self.modules = modules

    self.client = self.modules["redis"].StrictRedis(host=ENDPOINT, port=6379, db=0)

  def key(self, path):
    return self.modules["hashlib"].md5(path.encode("utf")).hexdigest()[ 0 : 15 ]

  def set(self, path):
    key = self.key(path)
    self.client.set(PREFIX + key, path)
    return key

  def get(self, key):
    self.client.get(PREFIX + key)
