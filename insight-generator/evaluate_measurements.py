import sys, re, nltk, os, json, requests, urllib, urllib2
import redis, hashlib, datetime

from tika     import parser

from extractors.quantity   import GrobidQuantityExtractor
from extractors.quantity   import QuantityExtractor
from extractors.extraction import Extraction
from extractors.content    import ContentExtractor

from extractors.main import InformationExtractor

from util.measurements  import extract_measurements as measurementExtractionFn

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

PATH   = sys.argv[1]

dependencies = {
  "os": os,
  "re": re,
  "nltk": nltk,
  "tika-parser": parser,
  "requests" : requests,
  "json" : json,
  "urllib" : urllib,
  "urllib2" :urllib2,
  "measurementExtractionFn": measurementExtractionFn,
  "datetime" : datetime
}

extractors = [
  GrobidQuantityExtractor,
  QuantityExtractor,
]

metaExtractor = InformationExtractor(extractors, ContentExtractor, dependencies)
d = metaExtractor.extract(Extraction(), PATH, persist_content=True).getData(PATH)
print json.dumps(d)
