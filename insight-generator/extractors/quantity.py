import os
from base import Extractor
ENDPOINT = os.environ["GROBID_QUANTITY_ENDPOINT"] + "/processQuantityText"

class QuantityExtractor(Extractor):
  def extract(self, content):

    request = self.modules["requests"].post(ENDPOINT, data=dict(text=content))

    try:
      measurements = self.modules["json"].loads(request.content)['measurements']
    except Exception as e:
      measurements = [ ]

    try:
      extMeasurements = reduce(self.extractMeasurement, measurements, [ ])
    except Exception as e:
      extMeasurements = [ ]

    self.extraction.accumulate("measurements", extMeasurements)

    return self.extraction

  def extractValue(self, q):
    return q

  def extractRange(self, m):
    res = []

    if 'quantityLeast' in m:
      res.append(self.extractValue(m['quantityLeast']))

    if 'quantityMost' in m:
      res.append(self.extractValue(m['quantityMost']))

    return res

  def extractMeasurement(self, acc, m):
    if m["type"] == 'value' and 'quantity' in m:
      return acc + [ self.extractValue(m['quantity']) ]
    elif m['type'] == 'interval':
      return acc + self.extractRange(m)
    else:
      return acc
