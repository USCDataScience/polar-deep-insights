## Steps for running insisight-generator on sparkler data input file and indexing on local Elasticsearch index 

1. Run ```./requirements.sh``` to download all the requirements inside requirements folder.

2. On a new terminal window, follow instructions from [here](https://github.com/elastic/elasticsearch) to start Elasticsearch:

3. On a new terminal window, follow instructions from [here](http://grobid-quantities.readthedocs.io/en/latest/gettingStarted.html) to run Grobid-Quantities:

4. On a new terminal window, follow instructions from [here](https://wiki.apache.org/tika/GeoTopicParser) to run GeoTopicParser

5. Download tika-server-1.15-SNAPSHOT.jar from [here](https://drive.google.com/open?id=1vPUudh39r0vkKdVx3gm01YZEbDScqJlD) and unzip it. 

5. On a new terminal window, run tika-server using this command 
```
java –jar tika-server-1.15-SNAPSHOT.jar
```
6. Set the environmental variables in env.sh

7. Run ```./elastic_index.sh```
