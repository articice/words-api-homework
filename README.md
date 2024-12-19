# Example words API with OpenSearch

# Running

##### Step 1: Run the docker-compose file to start OpenSearch.

Run (on a Linux):
```
sudo swapoff -a
sudo sysctl vm.max_map_count=262144
docker-compose up
``` 
If you have a partition with low disk free percentage, default settings of OpenSearch won't work and cluster will lock indexes as read-only.
To mitigate, either 
- add a binding to some other partition into docker-compose
```
volumes:
  opensearch-data1:
    driver: local
    driver_opts:
      type: 'none'
      o: 'bind'
      device: '/path/to/mounted/volume/with/a/lot/of/free/space'
``` 
- modify settings by executing queries from [docs/troubleshooting]

For more details, see [Installing OpenSearch / Docker](https://opensearch.org/docs/latest/install-and-configure/install-opensearch/docker/).

##### Step 2: Initialize OpenSearch with index and test data 
After OpenSearch is up, run all queries from [opensearch.http](./opensearch.http).

You'll need JetBrains [HTTP Client](https://www.jetbrains.com/help/webstorm/http-client-in-product-code-editor.html) or [VSCode REST Client](https://github.com/Huachao/vscode-restclient) IDE extension.

##### Step 3: Run demo webserver
It's already built in ZIP file, run it using a recent NodeJS version, using:
```
npm run start
```

# Testing API

Use requests from [api.http](./api.http) to run some examples.
