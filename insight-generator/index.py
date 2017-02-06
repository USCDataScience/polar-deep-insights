import sys, elasticsearch, json
from util.elastic import ESIndex

PATH        = sys.argv[1]
HOST        = sys.argv[2]
INDEX       = sys.argv[3]
DTYPE       = sys.argv[4]

es = ESIndex(HOST, INDEX, DTYPE, {
  "elasticsearch" : elasticsearch
})

f = open(PATH, "r")
lineNumber = 0

for line in f:
  lineNumber = lineNumber + 1
  try:
    d = json.loads(line.strip('\n'))
    del d['crawl-hash']['outlinks']
    print " INDEXING : " + d["id"] + " LINE NUMBER : " + str(lineNumber)
    es.write(d)
  except Exception as e:
    print e
    print >> sys.stderr, str(lineNumber)

f.close()

print "SUCCESSFULLY INDEXED ALL DOCUMETNS"
