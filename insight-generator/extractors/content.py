# Required modules
# tika-parser: from tika import parser

class ContentExtractor:
  def __init__(self, path, modules):
    self.__modules = modules
    self.path = path

  def extract(self, include_metadata=False):
    parsed   = self.__modules["TikaWrapper"](self.path, self.__modules).get()
    content  = self.__modules["TikaWrapper"](parsed["content"], self.__modules, raw=True).getTRR()

    self.content_type = parsed["metadata"]["Content-Type"]

    if self.isExtractableImage():
      d = self.imageObjectExtractor()
      content = "\n".join(d)

    if include_metadata:
      md_string = "\n".join( map(str, parsed["metadata"].values()) )
      content = md_string + "\n" + content

    return (content, parsed["metadata"])

  def isExtractableImage(self):
    return self.content_type == "image/jpeg"

  def imageObjectExtractor(self):
    return self.__modules["TikaWrapper"](self.path, self.__modules).getImageObjects()
