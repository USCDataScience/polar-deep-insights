import sys, re, nltk, os, json, requests, urllib, urllib2
import redis, hashlib

from tika     import parser
from nltk.tag import StanfordNERTagger

from extractors.entity     import EntityExtractor
from extractors.location   import GeoTopicExtractor
from extractors.quantity   import GrobidQuantityExtractor
from extractors.quantity   import QuantityExtractor
from extractors.ner        import NERExtractor
from extractors.extraction import Extraction
from extractors.content    import ContentExtractor

from extractors.main import InformationExtractor

from util.doi           import DocumentIdentifier
from util.dtree         import DirTreeTraverser

ROOT_PATH     = sys.argv[1]
OUTPUT_PATH   = sys.argv[2]

tagger = StanfordNERTagger(os.environ["STANDFORD_NER_MODEL_PATH"])

extractors = [
  EntityExtractor,
  NERExtractor,
  GrobidQuantityExtractor,
  # QuantityExtractor,
  GeoTopicExtractor,
]

dependencies = {
  "os": os,
  "re": re,
  "nltk": nltk,
  "tagger": tagger,
  "tika-parser": parser,
  "requests" : requests,
  "json" : json,
  "urllib" : urllib,
  "urllib2" :urllib2,
  "measurementExtractionFn": measurementExtractionFn,
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

def process(path):
  d = metaExtractor.extract(Extraction(), path).getData(idf.set(path))
  persistExtraction(d)

DirTreeTraverser(ROOT_PATH).traverse(process)


