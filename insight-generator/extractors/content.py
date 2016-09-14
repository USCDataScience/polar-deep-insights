# Required modules
# tika-parser: from tika import parser

class ContentExtractor:
  def __init__(self, path, modules):
    self.__modules = modules
    self.path = path

  def extract(self, include_metadata=False):
    parsed = self.__modules["tika-parser"].from_file(self.path)
    metadata = parsed["metadata"]

    content  = self.__modules["TikaWrapper"](parsed["content"], self.__modules).getTRR()

    if include_metadata:
      md_string = "\n".join( map(str, metadata.values()) )
      content = md_string + "\n" + content

    return (content, metadata)
