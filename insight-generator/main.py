import sys
import traceback

import os
from os import listdir, stat
from os.path import join, isdir, getsize

from util.doi import DocumentIdentifier

from ner.stanford_extractor import StanfordExtractor
from ner.custom_extractor   import CustomEntityExtractor
from ner.geo_topic          import GeoTopic
from ner.quantity           import QuantityExtractor

import tika
from tika import parser

import elasticsearch
import json

log = open("error.log", "a")
idf = DocumentIdentifier()
es = elasticsearch.Elasticsearch('http://104.236.190.155:9200')

def extract(path):
  parsed = parser.from_file(path)
  content = parsed["content"]

  ners = StanfordExtractor(content).extract()
  entities = CustomEntityExtractor(content).extract()
  quantities = QuantityExtractor(content).getQuantities()

  if len(ners['LOCATION']) > 0:
    l = GeoTopic(map(lambda l: l['name'], ners['LOCATION']))
    geo = l.getInfo()
    locations = l.getLocations()
  else:
    geo = [ ]
    locations = [ ]

  return {
    'geo' : geo,
    'locations' : locations,
    'entities': entities['entities'],
    'places': ners['LOCATION'],
    'dates': ners['DATE'],
    'quantities': quantities,
    'metadata': parsed['metadata'],
    'mime-type': parsed['metadata']['Content-Type'],
    'id': idf.set(path)
  }

def listFolders(path):
  return filter(lambda f: isdir(join(path, f)), listdir(path))

PATH = "/Users/nithinkrishna/Desktop/application-pdf"

for f in listFolders(PATH):
  for file in listdir(join(PATH, f)):

    try:
      path = join(PATH, f, file)
      print " --- Extracting {0} ---".format(path)
      extracted = extract(path)
      es.index(index='polar-deep', doc_type='docs', body=extracted, id=extracted["id"])
      print extracted

    except Exception as e:
      log.write("{0}\n".format(path))
      print " --- ERROR while processing {0} ----\n".format(path)
      print "{0}\n".format(e)
      print traceback.format_exc()
