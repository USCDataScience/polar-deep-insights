import urllib, urllib2
import json

GEO_TOPIC_ENDPOINT = "http://localhost:8765/api/search?"

class GeoTopic:
  def __init__(self, locations):
    self.locations = locations

    self.params = "&".join(map(lambda l: "s={0}".format(urllib.quote(l)), locations))

    self.response = urllib2.urlopen(GEO_TOPIC_ENDPOINT + self.params).read()
    self.info = json.loads(self.response)

  def formatInfo(self, l):
    return {
     'name': l[0]['name'],
     'countryCode': l[0]['countryCode'],
     'location': {
        'lat': l[0]['latitude'],
        'lon': l[0]['longitude']
     },
     'admin1Code': l[0]['admin1Code'],
     'admin2Code': l[0]['admin2Code']
    }

  def getInfo(self):
    return map(lambda i: self.formatInfo(i), self.info.values())

  def getLocations(self):
    return map(lambda i: self.formatInfo(i)['location'], self.info.values())
