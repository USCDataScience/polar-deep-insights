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

  def extract(self, extraction, path, persist_content=False):
    (content, metadata) = self.ContentExtractor(path, self.__modules).extract()

    extraction.data["metadata"] = metadata

    if persist_content:
      extraction.content        = content

    return reduce(lambda extraction, Extractor: Extractor(extraction, self.__modules).extractionStats(content), self.extractors, extraction)
