import sys, re, nltk, os, json, requests, urllib, urllib2, traceback
import redis, hashlib

from tika     import parser
from nltk.tag import StanfordNERTagger
from nltk.tokenize import word_tokenize

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
ERROR_PATH    = sys.argv[3]

tagger = StanfordNERTagger(os.environ["STANDFORD_NER_MODEL_PATH"],encoding='utf-8')

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
  "urllib" :urllib,
  "urllib2" :urllib2,
  "TmpFile": TmpFile,
}

metaExtractor = InformationExtractor(extractors, ContentExtractor, dependencies)

c=0
for l in open(PATH):
  cw = json.loads(l.strip("\n"));
  try:
    crawlHash = { k: cw[k] for k in cw if k not in ['raw_content', 'id', 'extracted_text'] }

    fw = TmpFile()
    fw.write(cw['extracted_text'])
    d = metaExtractor.extract(Extraction(), fw.path, include_metadata=False).getData(cw['id'], crawlHash)
    print d
    FILE = '{0}_{1}.json'.format(OUTPUT_PATH, c)
    f = open(FILE, "w")
    f.write(json.dumps(d))
    f.close()
    #fw.close()
    fw.destroy()
  except:
    e = open(ERROR_PATH, "a")
    e.write("ERROR: " + cw['id'] + "\n")
    traceback.print_exc(file=e)
    e.close()
  c+=1

