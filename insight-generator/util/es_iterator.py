import elasticsearch

class ESIterator:
  def __init__(self, connectionString):
    self.connection = elasticsearch.Elasticsearch([connectionString])

  def paginate(self, job, index='test-index', doc_type='mydoc', size=1000, scroll='2m', search_type = 'scan'):
    search = self.connection.search(index=index, doc_type=doc_type, scroll=scroll, search_type=search_type, size=size)
    sid = search['_scroll_id']
    scroll_size = search['hits']['total']

    while (scroll_size > 0):
      page = self.connection.scroll(scroll_id = sid, scroll = '2m')
      documents = page['hits']['hits']

      sid = page['_scroll_id']
      scroll_size = len(documents)

      for document in documents:
        job(document['_source'])

if __name__ == "__main__":
  import sys
  import math
  import numpy as np
  import json

  connectionString = sys.argv[1]
  index            = sys.argv[2]
  doc_type         = sys.argv[3]

  es = ESIterator(connectionString)

  entity_doc_count = { }
  entity_tf_count  = { }
  entity_if_idf    = { }

  def process(document):
    entities = document['entities']

    for e in entities:
      if e['name'] not in entity_doc_count:
        entity_doc_count[e['name']] = 0

      if e['name'] not in entity_tf_count:
        entity_tf_count[e['name']] = 0

      entity_doc_count[e['name']] = entity_doc_count[e['name']] + 1
      entity_tf_count[e['name']]  = entity_tf_count[e['name']] + e['tf']


  es.paginate(process, index=index, doc_type=doc_type)

  N_DOCS = 46872.0

  for e in entity_doc_count:
    idf = math.log( 1 + (N_DOCS / entity_doc_count[e]) )
    tf  = ( np.log( 1 + np.array(entity_tf_count[e])) ).mean()

    entity_if_idf[e] = tf * idf

  json.dump(entity_if_idf, open('entity_distribution.json', 'wb'))
