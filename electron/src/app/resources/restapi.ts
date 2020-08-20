export const restApi = {
  getSearchList: '/doc-index/_doc/_search?size=10000&pretty',
  insert: '/doc-index/_doc/',
  edit: '/doc-index/_doc/{:id}/_update',
  delete: '/doc-index/_doc/{:id}',
  release: '/_settings',
};
