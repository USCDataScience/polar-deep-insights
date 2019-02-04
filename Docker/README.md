This is the Dockerized version of Polar-deep-insights project. Two parts of the project, insight-generator which is a python library used to extract information and insight-visualizer which is a javascript application used for data visualization can be installed and run on Docker containers using PDI Docker.  

## Pre-Reqs
1. Install Node and NPM from [here](https://nodejs.org/en/) if you don't have it already installed. 
1. Install elasticsearch-tools (https://www.npmjs.com/package/elasticsearch-tools)
    `sudo npm install -g elasticsearch-tools`
2. Export the mappings and data from `polar.usc.edu/elasticsearch` (Or any other elastic search index)<br/>
  a. `es-export-mappings --url http://polar.usc.edu/elasticsearch --file /data/polar/polar-data-mappings.json`<br/>
  b. `es-export-bulk --url http://polar.usc.edu/elasticsearch --file /data/polar/polar-data.json` 
  Note: Step 3b will take a while *and is optional*

## Insight-Generator Installation

Assuming you used `/data/polar` for pre-reqs mapping and JSON data location, then, you can have `/data/polar`. 

### Providing input to insight-generator

1. You can use the polar.usc.edu elastic data by downloading it and placing it inside `data/polar/` (mappings file need to be placed inside this folder for any input) folder or provide your own input by doing one of the following below and replacing http://polar.usc.edu/elasticsearch URL with your local elastic index URL.
2. a. Place the input inside `data/polar/files` folder if you need to give pdf input (or)
   b. Place the Sparkler input from Solr index inside `data/polar/sparkler/raw` folder. Name the file sparkler_data.json (or)
   c. Place the Sparkler input after running parse.py on it inside `data/polar/sparkler/parsed` folder. Name the file sparkler_rawdata.json
3. Create an empty file called ingest_data.json inside `data/polar/ingest` folder. This is where the data extracted from step 2 will be stored.

### Important Files

 1. [conv-prep-sparkler.sh](https://github.com/USCDataScience/polar-deep-insights/blob/master/insight-generator/conv-prep-sparkler.sh) - Contacts sparkler (assuming http://localhost:8983) and grabs Solr JSON from it. Parses the data into a format used by Polar Deep Insights (PDI) generator using `parse.py` below.
 2. [parse.py](https://github.com/USCDataScience/polar-deep-insights/blob/master/insight-generator/parse.py) - Takes Sparkler RAW output and converts from `sparkler_rawdata.json` to `sparkler_data.json` and removes the outer Solr doc/response into just the `{` and `}` delimited JSON objects.
 3. [tika-prepare.py](https://github.com/USCDataScience/polar-deep-insights/blob/master/insight-generator/tika-prepare.py) - Uses [Tika Python](http://github.com/chrismattmann/tika-python.git) to extract raw text, and to generate an ID from any file present in the `/files` directory of your data layout below. Metadata is discarded, and only raw extracted text is used.
 4. [elastic-index.sh](https://github.com/USCDataScience/polar-deep-insights/blob/master/insight-generator/elastic_index.sh) - Deletes the prior `insight-generator` index from `http://polar-deep-insights/elasticsearch/` and then recreates it with the schema defined in [di-mapping-schema.json](https://github.com/USCDataScience/polar-deep-insights/blob/master/insight-generator/di-mapping-schema.json). Calls `extract.py` to run the PDI generation pipeline described below, and then proceeds to iterate over the resultant JSON documents in the `out` directory with prefix `output_` e.g., `out/output_1.json` and to ingest them into `http://polar-deep-insights/elasticsearch/insight-generator/_docs`.
 5. [extract.py](https://github.com/USCDataScience/polar-deep-insights/blob/master/insight-generator/extract.py) - Takes data in `ingest/ingest_data.json` and runs the PDI extraction pipeline e.g., [Stanford CoreNLP/NER](https://stanfordnlp.github.io/CoreNLP/), [Grobid Quantities](https://github.com/kermitt2/grobid-quantities), [Geo Topic Parser](https://github.com/chrismattmann/lucene-geo-gazetteer), [Tika Python](http://github.com/chrismattmann/tika-python.git), and custom data extractors to build up individual JSON files to be ingested into Elastic Search.
 6. [entrypoint.sh](https://github.com/USCDataScience/polar-deep-insights/blob/master/Docker/insight-generator/entrypoint.sh) - Used by [PDI Generator Docker]() to do the following:<br/>
     a. Wait for `http://polar-deep-insights/elasticsearch/` to be ready to work with.<br/>
     b. Start up Tika Server, Geo Topic Parser, and Grobid Quantities (takes a while) servers and logs their output to `/deploy/requirements/logs/pdi-generator.log`<br/>
     c. Waits on Grobid Quantities to start up since it takes a while.<br/>
     d. Generate `ingest/ingest_data.json` either by:<br/>
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. Take `sparkler/raw/sparkler_rawdata.json`, run `parse.py` on it to generate `ingest/ingest_data.json`<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ii. Take `sparkler/parsed/sparkler_data.json` and copy it to `ingest/ingest_data.json`<br/>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iii. Take `files/*`, run `tika-prepare.py` on it to generate `ingest/ingest_data.json`<br/>
     e. Run `extract.py` on `ingest/ingest_data.json` to generate `$PDI_HOME/insight-generator/out/*.json` and then to ingest into `http://polar-deep-insights/elasticsearch/insight-generator/_docs`.
     

### Layout

```
   /data/polar/
   polar-data-mappings.json --- The downloaded schema from http://polar.usc.edu/elasticsearch/
   polar-data.json          --- The downloaded data contents from http://polar.usc.edu/elasticsearch/
              /sparkler/          --- You are providing Sparkler crawled data to the insights generator, see below
                      /raw             --- Provide a raw sparkler file named sparkler_rawdata.json, and will use parse.py to convert to sparkler_data.json
                      /parsed          --- Provide a parsed sparkler file (with the { and } removed as per parse.py) named sparkler_data.json
              /files/             --- Can be any file type, in any folder, all will be parsed using tika-prepare.py to create ingest/ingest_data.json
              /ingest/            --- Is where the ingest_data.json file is created by the PDI generator using extract.py

```

### Building

1. `git clone https://github.com/USCDataScience/polar-deep-insights.git && cd polar-deep-insights/Docker/insight-generator`
2.  `docker build -t uscdatascience/pdi-generator -f InsightGenDockerfile .`<br/>
(or optionally, if you don't want to build locally and just [pull from dockerhub](https://hub.docker.com/r/uscdatascience/pdi-generator/))<br/>
`docker pull uscdatascience/pdi-generator`
3. `PDI_JSON_PATH=/data/polar docker-compose up -d`


### Monitoring the Container

Use this command to monitor what's going on in the container

1. `docker logs -f docker_pdi-generator_1` # replace docker_pdi-generator_1 with the container id or tag

### Logging onto the Container with a Bash Shell

Use this command to log onto the container. Note that the pdi user has sudo access if you need it.

1. `docker exec -it docker_pdi-generator_1 bash`

### Ports

The container exposes:

* `8765` - Geo Topic Parser
* `9998` - Apache Tika Server
* `8060` - Grobid Quantities REST API


## Insight-Visualizer Installation 
Assuming you used `/data/polar` for the pre-reqs mapping and JSON data location, then:

1. `git clone https://github.com/USCDataScience/polar-deep-insights.git && cd polar-deep-insights/Docker/insight-visualizer`
2.  `docker build -t uscdatascience/polar-deep-insights -f PolarDeepInsightsDockerfile .`<br/>
(or optionally, if you don't want to build locally and just [pull from dockerhub](https://hub.docker.com/r/uscdatascience/polar-deep-insights/))<br/>
`docker pull uscdatascience/polar-deep-insights`
3. `PDI_JSON_PATH=/data/polar docker-compose up -d` 

After the execution completes, the Application can be accessed on this url:
http://localhost/pdi/

And Elasticsearch is available from:

http://localhost/elasticsearch/

**Note:** You need to add CORS extension to the browser and to enable it in order to download concept ontology and additional precomputed information from `http://polar.usc.edu/elasticsearch/` and elsewhere. 

### Monitoring the Container

Use this command to monitor what's going on in the container

1. `docker logs -f docker_polar-deep-insights_1` # replace docker_polar-deep-insights_1 with the container id or tag

### Logging onto the Container with a Bash Shell

Use this command to log onto the container. Note that the pdi user has sudo access if you need it.

1. `docker exec -it docker_polar-deep-insights_1 bash`

### Ports

The container exposes:

* `80` - Apache2/HTTPD server
* `9000` - Grunt server servig up the PDI application
* `9200` - Elasticsearch 2.4.6 server
* `35729` - Auto refresh port for AngularJS apps


