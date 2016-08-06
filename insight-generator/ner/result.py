class EntityResult:
  def __init__(self):
    self.data = {
      'entities'     : [ ],
      'LOCATION'     : [ ],
      'DATE'         : [ ],
    }

  def accumulate(self, d):
    for k in d:
      if k in self.data:
        self.data[k] = self.data[k] + d[k]

  def freqDistribution(self):
    ed = { }

    def fd(l):
      dist = { }
      for e in l:
        if e not in dist:
          dist[e] = 0
        dist[e] = dist[e] + 1

      return map(lambda k: { 'name': k, 'count': dist[k] }, dist.keys())

    for key in self.data.keys():
      ed[key] = fd(self.data[key])

    return ed
