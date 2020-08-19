FROM docker.elastic.co/elasticsearch/elasticsearch:7.8.0

COPY --chown=elasticsearch:elasticsearch ./elasticsearch.yml /usr/share/elasticsearch/config/

# install plugin
RUN elasticsearch-plugin install -b https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.8.0/elasticsearch-analysis-ik-7.8.0.zip
