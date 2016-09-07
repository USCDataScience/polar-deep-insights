# expects modules {
#   "elasticsearch": elasticsearch,
# }

class ESIndex:
  def __init__(self, connectionString, index, docType, modules):
    self.modules = modules

    self.index   = index
    self.docType = docType

    self.connection = self.modules["elasticsearch"].Elasticsearch([connectionString])

  def write(self, data):
    self.connection.index(self.index, self.docType, body=data, id=data["id"])
