class Extractor(object):
  def __init__(self, extraction, modules):
    self.modules = modules
    self.extraction = extraction

  def extractionStats(self, content):
    start      = self.modules["datetime"].datetime.now()
    extraction = self.extract(content)
    end        = self.modules["datetime"].datetime.now()
    extraction.stats[self.__class__.__name__] = (end - start).total_seconds()
    return extraction


  def extract(self, content):
    raise NotImplementedError("method extractor needs be overridden")

  def sentTokenize(self, content):
    return self.modules["nltk"].tokenize.sent_tokenize(content)

  def wordTokenize(self, content):
    return self.modules["nltk"].tokenize.word_tokenize(content)
