# Commands to Run Polar-deep-insights on Docker:

1.  git clone https://github.com/USCDataScience/polar-deep-insights.git && cd polar-deep-insights/Docker
2.  docker build -f PolarDeepInsightsDockerfile -t uscdatascience/polar-deep-insights .
3. cd ../insight-visualizer/
4. docker run --rm -it -v "$PWD:/home/user/src" -p 9000:9000 -p 35729:35729 uscdatascience/polar-deep-insights

After the execution completes, the Application can be accessed on this url:
http://0.0.0.0:9000/#!/config

**Note:** You need to add CORS extension to the browser and enable it in-order to Download concept ontology and additional precomputed information.
