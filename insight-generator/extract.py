import sys, re, nltk, os, json, requests, urllib, urllib2
import redis, hashlib

from tika     import parser
from nltk.tag import StanfordNERTagger

from extractors.entity     import EntityExtractor
from extractors.location   import GeoTopicExtractor
from extractors.quantity   import QuantityExtractor
from extractors.ner        import NERExtractor
from extractors.extraction import Extraction
from extractors.content    import ContentExtractor

from extractors.main import InformationExtractor

from util.doi import DocumentIdentifier
from util.dtree import DirTreeTraverser

PATH   = sys.argv[1]

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
}

metaExtractor = InformationExtractor(extractors, ContentExtractor, dependencies)

idf = DocumentIdentifier({
  "redis": redis,
  "hashlib": hashlib,
})

d = metaExtractor.extract(Extraction(), PATH).getData(idf.set(PATH))
print json.dumps(d)
