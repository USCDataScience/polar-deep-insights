import requests
import json

ENDPOINT = "http://localhost:8080/processQuantityText"

class QuantityExtractor:
  def __init__(self, content):
    request = requests.post(ENDPOINT, data=dict(text=content))

    try:
      self.measurements = json.loads(request.content)['measurements']
    except Exception as e:
      self.measurements = [ ]

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

  def getQuantities(self):
    try:
      return reduce(self.extractMeasurement, self.measurements, [ ])
    except Exception as e:
      print " QUANTITES ERROR {0}".format(e)
      return [ ]

