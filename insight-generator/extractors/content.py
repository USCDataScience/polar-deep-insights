# Required modules
# tika-parser: from tika import parser

class ContentExtractor:
  def __init__(self, path, modules):
    self.__modules = modules
    self.path = path

  def extract(self):
    parsed = self.__modules["tika-parser"].from_file(self.path)
    metadata = parsed["metadata"]
    md_string = "\n".join( map(str, metadata.values()) )
    content  = self.__modules["TikaWrapper"](parsed["content"], self.__modules).getTRR()
    return (md_string + "\n" + content, metadata)
