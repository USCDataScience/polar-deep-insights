import sys, re, nltk, os, json, requests, urllib, urllib2
import redis, hashlib

import elasticsearch

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
from util.elastic       import ESIndex
from util.measurements  import extract_measurements as measurementExtractionFn

ROOT_PATH   = sys.argv[1]
ES_INDEX    = sys.argv[2]
INDEX_NAME  = sys.argv[3]
DOC_TYPE    = sys.argv[4]

tagger = StanfordNERTagger(os.environ["STANDFORD_NER_MODEL_PATH"])

extractors = [
  EntityExtractor,
  NERExtractor,
  #GrobidQuantityExtractor,
  QuantityExtractor
  GeoTopicExtractor,
]

dependencies = {
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

es = ESIndex(ES_INDEX, INDEX_NAME, DOC_TYPE, {
  "elasticsearch": elasticsearch,
})

def process(path):
  d = metaExtractor.extract(Extraction(), path).getData()
  d["id"] = idf.set(path)
  es.write(d)

DirTreeTraverser(ROOT_PATH).traverse(process)


