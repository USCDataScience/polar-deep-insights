## Steps for running insisight-generator on sparkler data input file and indexing on local Elasticsearch index 

1. Run [Sparkler](https://github.com/USCDataScience/sparkler) on a set of seed urls.

2. Run ```./requirements.sh``` to download all the requirements inside requirements folder.

3. On a new terminal window, follow instructions to start [Elasticsearch](https://github.com/elastic/elasticsearch)

4. On a new terminal window, follow instructions to run [Grobid-Quantities](http://grobid-quantities.readthedocs.io/en/latest/gettingStarted.html)

5. On a new terminal window, follow instructions to run [GeoTopicParser](https://wiki.apache.org/tika/GeoTopicParser)

7. Download [tika-server-1.15-SNAPSHOT.jar](https://drive.google.com/open?id=1vPUudh39r0vkKdVx3gm01YZEbDScqJlD) and unzip it. 

8. On a new terminal window, run tika-server using this command 
```
java –jar tika-server-1.15-SNAPSHOT.jar
```
9. Change CLASSPATH and STANDFORD_NER_MODEL_PATH environment variables in [env.sh](https://github.com/USCDataScience/polar-deep-insights/blob/master/insight-generator/env.sh)

10. Run ```./elastic_index.sh```

11. Follow instructions to run insight-visualizer application on [Docker](https://github.com/USCDataScience/polar-deep-insights/tree/master/Docker)

12. On [http://0.0.0.0:9000/#!/config](http://0.0.0.0:9000/#!/config) page set the fields to the following values.
    
    a. Elastic search endpoint            : http://localhost:9200
    
    b. Elastic search extraction index    : insight-generator
   
    c. Elastic search extraction doc-type :        docs           
