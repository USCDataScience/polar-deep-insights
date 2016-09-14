ENDPOINT = "http://localhost:8080/processQuantityText"

from base import Extractor

class GrobidQuantityExtractor(Extractor):
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

    self.extraction.accumulate("grobid-measurements", extMeasurements)

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

# Expects "measurementExtractionFn"
class QuantityExtractor(Extractor):
  def extract(self, content):
    try:
      extMeasurements = self.modules["measurementExtractionFn"](content=str(content), input_dir=None, show_graph=False, verbose=False)
    except Exception as e:
      extMeasurements = [ ]

    self.extraction.accumulate("parse-tree-measurements", self.parse(extMeasurements))

    return self.extraction

  # Considering the first number from the string
  def parse(self, extMeasurements):
    m = [ ]
    for e in extMeasurements:
      num = e["num"]
      num.replace(',', '')
      values = [ int(s) for s in num.split() if s.isdigit() ]
      m = m + map(lambda v: { 'unit' : e['unit'], 'value': v }, values)
    return m


