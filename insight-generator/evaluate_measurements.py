import sys, re, nltk, os, json, requests, urllib, urllib2
import redis, hashlib, datetime

from tika      import parser
from tika.tika import callServer

from extractors.quantity   import GrobidQuantityExtractor
from extractors.quantity   import QuantityExtractor
from extractors.extraction import Extraction
from extractors.content    import ContentExtractor

from extractors.main import InformationExtractor

from util.measurements  import extract_measurements as measurementExtractionFn
from util.xtika         import TikaWrapper

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

PATH   = sys.argv[1]

dependencies = {
  "os": os,
  "re": re,
  "nltk": nltk,
  "tika-parser": parser,
  "tika-server-request-fn": callServer,
  "TikaWrapper": TikaWrapper,
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
