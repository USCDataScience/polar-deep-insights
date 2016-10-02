import sys, re, nltk, os, json, requests, urllib, urllib2
import redis, hashlib

from tika     import parser
from nltk.tag import StanfordNERTagger

from extractors.entity      import EntityExtractor
from extractors.location    import GeoTopicExtractor
from extractors.quantity    import QuantityExtractor
from extractors.ner         import NERExtractor
from extractors.extraction  import Extraction
from extractors.content     import ContentExtractor
from extractors.stat        import StatExtractor

from extractors.main import InformationExtractor

from util.doi           import DocumentIdentifier
from util.xtika         import TikaWrapper
from util.util          import TmpFile

PATH          = sys.argv[1]
OUTPUT_PATH   = sys.argv[2]

tagger = StanfordNERTagger(os.environ["STANDFORD_NER_MODEL_PATH"])

extractors = [
  EntityExtractor,
  NERExtractor,
  QuantityExtractor,
  GeoTopicExtractor,
  StatExtractor,
]

dependencies = {
  "sys": sys,
  "os": os,
  "re": re,
  "nltk": nltk,
  "tagger": tagger,
  "tika-parser": parser,
  "TikaWrapper" : TikaWrapper,
  "requests" : requests,
  "json" : json,
  "urllib" : urllib,
  "urllib2" :urllib2,
  "TmpFile": TmpFile,
}

metaExtractor = InformationExtractor(extractors, ContentExtractor, dependencies)

idf = DocumentIdentifier({
  "redis": redis,
  "hashlib": hashlib,
})

def persistExtraction(d):
  f = open(OUTPUT_PATH, "a")
  f.write(json.dumps(d))
  f.write("\n")
  f.close()

d = metaExtractor.extract(Extraction(), PATH, include_metadata=True).getData(idf.set(PATH))
persistExtraction(d)
