#!/bin/bash
#!usr/bin/env python .

source env.sh

cd requirements

bin/elasticsearch

curl -XDELETE 'localhost:9200/insight-generator'

# create ElasticSearch index
curl -XPOST 'http://localhost:9200/insight-generator' -d '{
  "settings": {
    "index": {
      "mapping.allow_type_wrapper": true
    }
  }
}'

# create mapping
curl -X POST -d '{
      "docs": {
        "properties": {
          "dates": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "long"
              }
            }
          },
          "entities": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          },
          "locations": {
            "type": "nested",
            "properties": {
              "admin1Code": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              },
              "admin2Code": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              },
              "countryCode": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              },
              "location": {
                "type": "geo_point",
                "lat_lon": true,
                "geohash": true
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              },
              "rawText": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              },
              "count": {
                "type": "long"
              }
            }
          },
          "id": {
            "type": "string"
          },
          "geo": {
            "type": "geo_point",
            "lat_lon": true,
            "geohash": true
          },
          "mime-type": {
            "type": "string",
            "fields": {
              "raw": {
                "type": "string",
                "index": "not_analyzed",
                "null_value": "NULL"
              }
            }
          },
          "places": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          },
          "people": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          },
          "organizations": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          },
          "money": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          },
          "percentages": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          },
          "time": {
            "type": "nested",
            "properties": {
              "count": {
                "type": "long"
              },
              "name": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          },
          "measurements": {
            "type": "nested",
            "properties": {
              "value": {
                "type": "long"
              },
              "unit": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed",
                    "null_value": "NULL"
                  }
                }
              }
            }
          }
        }
      }
}' "http://localhost:9200/insight-generator/docs/_mapping"

# get the indices
curl 'localhost:9200/_cat/indices?v'

DIRECTORY="out"

if [ -d $DIRECTORY ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  rm -rf $DIRECTORY
fi
mkdir $DIRECTORY
python extract.py sparkler_data.json $DIRECTORY/output error

cd $DIRECTORY

# uploading Insight-generator output onto ElasticSearch index 
for x in *; do
	echo $x
	curl -X POST 'http://localhost:9200/insight-generator/docs' -d @$x
done