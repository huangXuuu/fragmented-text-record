# fragmented-text-record
碎片式文字记录

## 需要的环境：
* elasticSearch 7.8.0
* node 10.16.3

## 安装依赖
进入electron目录，执行以下命令：
* npm install

## 启动
* npm run start

## 打包（根据操作系统自行选择）
* npm run electron:windows
* npm run electron:linux
* npm run electron:mac

## 配置【分类】项目的下拉选项列表
将electron/resources文件夹及其中的csv拷贝至exe同级目录下
注意：
* csv编码必须为utf-8
* csv只能有一列
