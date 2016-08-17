class Extraction:
  def __init__(self):
    self.data = { }

  def get(self, k):
    if k in self.data:
      return self.data[k]

  def accumulate(self, entity, d):
    if not entity in self.data:
      self.data[entity] = [ ]

    self.data[entity] = self.data[entity] + d

  def getData(self):
    return {
      "dates"        : self.count("DATE"),
      "entities"     : self.count("entities"),
      "places"       : self.count("LOCATION"),
      "people"       : self.count("PERSON"),
      "organizations": self.count("ORGANIZATION"),
      "money"        : self.count("MONEY"),
      "percentages"  : self.count("PERCENT"),
      "time"         : self.count("TIME"),
      "locations"    : self.get("locations"),
      "geo"          : self.get("geo"),
      "measurements" : self.get("measurements"),
      "metadata"     : self.get("metadata"),
    }

  def countHash(self, key):
    d = self.get(key)

    if not d:
      return { }

    return reduce(lambda m,e: m.update({ e: ( 1 if e not in m else m[e] + 1 ) }) or m, d, { })

  def count(self, key):
    d = self.countHash(key)
    return map(lambda entity: { 'name': entity, 'count': d[entity] }, d.keys())
