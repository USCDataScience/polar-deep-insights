import re
import nltk
from nltk.tag import StanfordNERTagger

from result import *

st = StanfordNERTagger('/Users/nithinkrishna/projects/open-source/stanford-ner-2015-12-09/classifiers/english.muc.7class.distsim.crf.ser.gz')

class StanfordExtractor:
  def __init__(self, content):
    self.content = content
    self.result = EntityResult()

  def _noramlizeDates(self):

    def toF(d):
      try:
        return float(d)
      except Exception as e:
        return 0


    self.result.data['DATE'] = reduce(lambda m,d: m + re.compile(r'\d{4}').findall(d) if len(d) > 4 else m + [ d ], self.result.data['DATE'], [ ])
    self.result.data['DATE'] = map(toF, self.result.data['DATE'])
    self.result.data['DATE'] = filter(lambda d: d!=0, self.result.data['DATE'])

  def extract(self):
    tags = st.tag(nltk.word_tokenize(self.content))
    iterator = 0

    while iterator < len(tags):
      if tags[iterator][1] != 'O':
        j = 1
        while iterator + j < len(tags) and tags[iterator][1] == tags[iterator + j][1]:
          j = j + 1


        chunks = map(lambda x: x[0], tags[iterator:iterator+j])
        entity = " ".join(chunks)

        self.result.accumulate({
          tags[iterator][1] : [ entity ],
        })

        iterator = iterator + j
      else:
        iterator = iterator + 1

    self._noramlizeDates()

    return self.result.freqDistribution()

