# elasticSearch配置

## 使用Docker
* docker-compose -f docker-compose.doc.yml up -d --force-recreate --build

## 不使用Docker
* 将**elasticsearch.yml**文件拷贝至elasticSearch的config目录下
* 在**elasticsearch-plugin**目录下执行下面指令以安装中文分词插件ik：
> install -b https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.8.0/elasticsearch-analysis-ik-7.8.0.zip
