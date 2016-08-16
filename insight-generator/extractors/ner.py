from base import Extractor

class NERExtractor(Extractor):
  def __init__(self, extraction, modules):
    super(NERExtractor, self).__init__(extraction, modules)

  def _noramlizeDates(self):
    def toF(d):
      try:
        return float(d)
      except Exception as e:
        return 0

    self.extraction.data['DATE'] = reduce(lambda m,d: m + self.modules["re"].compile(r'\d{4}').findall(d) if len(d) > 4 else m + [ d ], self.extraction.data['DATE'], [ ])
    self.extraction.data['DATE'] = map(toF, self.extraction.data['DATE'])
    self.extraction.data['DATE'] = filter(lambda d: d!=0, self.extraction.data['DATE'])

  def extract(self, content):

    tags = self.modules["tagger"].tag(self.wordTokenize(content))
    iterator = 0

    while iterator < len(tags):
      if tags[iterator][1] != 'O':
        j = 1
        while iterator + j < len(tags) and tags[iterator][1] == tags[iterator + j][1]:
          j = j + 1

        chunks = map(lambda x: x[0], tags[iterator:iterator+j])
        entity = " ".join(chunks)

        self.extraction.accumulate(tags[iterator][1], [ entity ])

        iterator = iterator + j
      else:
        iterator = iterator + 1

    self._noramlizeDates()

    return self.extraction

