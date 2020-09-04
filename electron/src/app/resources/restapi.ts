export const restApi = {
  getSearchList: '/{:index}/_doc/_search?size=10000&pretty',
  insert: '/{:index}/_doc/',
  edit: '/{:index}/_doc/{:id}/_update',
  delete: '/{:index}/_doc/{:id}',
  release: '/_settings',
  catIndex: '/_cat/aliases?format=json',
  createIndex: '/{:index}',
  addAliasToIndex: '/_aliases',
  deleteIndex: '/{:index}'
};
