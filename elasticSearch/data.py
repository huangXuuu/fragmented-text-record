# 所有文件的处理
import json
import base64
import pprint
import json
import warnings
import requests
import datetime
from elasticsearch import Elasticsearch

import xlrd
import pandas as pd


# ignore all warnings
warnings.filterwarnings('ignore')

res_path = './data/resource/'
output_path = './data/resource/data.json'

es = Elasticsearch(hosts=["localhost:9200"])
es_mapping = './data/resource/analyzer_mapping.json'
INDEX_NAME = 'doc-index'


# create index
# es_mapping_file = open(es_mapping, 'r')
# es_mapping_json = json.load(es_mapping_file)
# index_exists = es.indices.exists(index=INDEX_NAME)
# if index_exists == True:
#     es.indices.delete(index=INDEX_NAME, ignore=[400, 404])
#     print('index had been deleted!')
# res = es.indices.create(index=INDEX_NAME, body=es_mapping_json)
# print('created new doc_index!')

# insert
item = {
    'class': '培训',
    'title': '测试',
    'content': '测试A',
    'createDate': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'updateDate': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}
res = es.index(index=INDEX_NAME, body=item, request_timeout=60)

print('data inserted!')

