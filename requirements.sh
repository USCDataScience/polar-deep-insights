#! /bin/bash

DIRECTORY="requirements"

if [ ! -d $DIRECTORY ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  mkdir $DIRECTORY
fi

cd $DIRECTORY

# Elasticsearch
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.3.0.zip
unzip elasticsearch-6.3.0.zip

# Stanford-ner
wget https://nlp.stanford.edu/software/stanford-ner-2018-02-27.zip

unzip stanford-ner-2018-02-27.zip

# Geo-topic-parser
git clone https://github.com/chrismattmann/lucene-geo-gazetteer.git

# Grobid - required for Grobid Quantities
git clone https://github.com/kermitt2/grobid.git

cd grobid 

# Grobid Quantities
git clone https://github.com/kermitt2/grobid-quantities.git

