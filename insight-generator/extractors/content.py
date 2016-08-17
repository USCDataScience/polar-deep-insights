# Required modules
# tika-parser: from tika import parser

class ContentExtractor:
  def __init__(self, path, modules):
    self.__modules = modules
    self.path = path

  def extract(self):
    # Handle content extraction depending on the mime-type
    parsed = self.__modules["tika-parser"].from_file(self.path)
    return (parsed["content"], parsed["metadata"])
