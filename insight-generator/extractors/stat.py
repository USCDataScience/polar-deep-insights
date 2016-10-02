from base import Extractor

class StatExtractor(Extractor):
  def __init__(self, extraction, modules):
    super(StatExtractor, self).__init__(extraction, modules)

  def extract(self, content):
    d = { }
    path = self.extraction.data["path"]

    d["file-size"] = self.modules["os"].stat(path).st_size
    d["extracted-text-size"] = self.modules["sys"].getsizeof( self.extraction.data["content"] )

    d["information-extracted"] = float(d["extracted-text-size"]) / d["file-size"]
    d["information-lost"] = ( 1 - d["information-extracted"] )

    d["metadata-size"] = self.modules["sys"].getsizeof( self.extraction.data["metadata"] )
    d["metadata-file-size-ratio"] = float(d["metadata-size"]) / d["file-size"]

    self.extraction.data["stat"] = d

    return self.extraction
