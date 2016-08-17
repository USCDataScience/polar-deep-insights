# REQUIRED MODULES
# modules = {
#   "re": re,
#   "nltk": nltk,
#   "tagger": StanfordNERTagger(os.environ["STANDFORD_NER_MODEL_PATH"]),
# }

class InformationExtractor:
  def __init__(self, extractors, ContentExtractor, modules):
    self.__modules = modules
    self.extractors = extractors
    self.ContentExtractor = ContentExtractor


  def extract(self, extraction, path):
    (content, metadata) = self.ContentExtractor(path, {
      "tika-parser" : self.__modules["tika-parser"]
    }).extract()

    extraction.data["metadata"] = metadata

    return reduce(lambda extraction, Extractor: Extractor(extraction, self.__modules).extract(content), self.extractors, extraction)
