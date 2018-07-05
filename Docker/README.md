# Pre-Reqs

1. Install [elasticsearch-tools](https://www.npmjs.com/package/elasticsearch-tools) from [NPM](http://npmjs.org/).
2. You will need to export the mappings and data from `polar.usc.edu/elasticsearch`<br/>
  a. `es-export-mappings --url http://polar.usc.edu/elasticsearch --file /data/polar/polar-data-mappings.json`<br/>
  b. `es-export-bulk --url http://polar.usc.edu/elasticsearch --file /data/polar/polar-data.json` (will take a while)

# Installation 
Assuming you used `/data/polar` for the pre-reqs mapping and JSON data location, then:

1. `git clone https://github.com/USCDataScience/polar-deep-insights.git && cd polar-deep-insights/Docker`
2.  `docker build -t uscdatascience/polar-deep-insights -f PolarDeepInsightsDockerfile .`
3. `PDI_JSON_PATH=/data/polar docker-compose up -d` 

After the execution completes, the Application can be accessed on this url:
http://localhost/pdi/

And Elasticsearch is available from:

http://localhost/elasticsearch/

**Note:** You need to add CORS extension to the browser and to enable it in order to download concept ontology and additional precomputed information from `http://polar.usc.edu/elasticsearch/` and elsewhere. 

# Monitoring the Container

Use this command to monitor what's going on in the container

1. `docker logs -f docker_polar-deep-insights_1` # replace docker_polar-deep-insights_1 with the container id or tag

# Logging onto the Container with a Bash Shell

Use this command to log onto the container. Note that the pdi user has sudo access if you need it.

1. `docker exec -it docker_polar-deep-insights_1 bash`

# Ports

The container exposes:

* `80` - Apache2/HTTPD server
* `9000` - Grunt server servig up the PDI application
* `9200` - Elasticsearch 2.4.6 server
* `35729` - Auto refresh port for AngularJS apps


