# Commands to Run Polar-deep-insights on Docker:

1. `git clone https://github.com/USCDataScience/polar-deep-insights.git && cd polar-deep-insights/Docker`
2.  `docker build -t uscdatascience/polar-deep-insights -f PolarDeepInsightsDockerfile .`
3. `docker run -p 35279:35279 -p 9000:9000 uscdatascience/polar-deep-insights`

After the execution completes, the Application can be accessed on this url:
http://0.0.0.0:9000/#!/config

**Note:** You need to add CORS extension to the browser and enable it in-order to Download concept ontology and additional precomputed information.
