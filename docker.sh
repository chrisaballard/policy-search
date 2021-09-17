# Pull the elasticsearch docker image
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.14.1
# Run elastic search container
docker run --name elasticsearch -d -m 5g -p 9200:9200 -e "discovery.type=single-node" -v elk_data:/usr/share/elasticsearch/data docker.elastic.co/elasticsearch/elasticsearch:7.14.1
# Pull the elasticseach kibana docker image
docker pull kibana:7.14.1
# Run kibana container
docker run --name kibana -d -p 5601:5601 -h kibana --link elasticsearch kibana:7.14.1