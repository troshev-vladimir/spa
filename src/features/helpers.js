export function renamePaginationParams(params) {
  params.per_page = params.rowsPerPage;
  delete params.rowsPerPage;
  return params;
}
