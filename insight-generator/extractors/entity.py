from base import Extractor

# Todo : Remove hard coded file path
ENTITY_FILE_PATH = "./data/entities.txt"

class EntityExtractor(Extractor):
  def __init__(self, extraction, modules):
    super(EntityExtractor, self).__init__(extraction, modules)
    self.entityFile = open(ENTITY_FILE_PATH)

  def generateExp(self):
    entities = [ e.strip() for e in self.entityFile ]
    regStr = r"({0})".format( "|".join( entities ) )
    return self.modules["re"].compile( regStr )

  def extract(self, content):
    entityExp = self.generateExp()
    map(lambda l: self.extraction.accumulate("entities", entityExp.findall(l)), self.sentTokenize(content))

    return self.extraction
