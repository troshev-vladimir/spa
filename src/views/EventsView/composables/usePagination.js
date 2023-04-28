import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

export default function usePagination(fetchFunc, loadingDepartment) {
  const router = useRouter();
  const route = useRoute();

  const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 3,
    rowsNumber: 0,
  });

  onMounted(() => {
    const query = Object.assign({}, route.query, {
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
    });

    router.replace({
      path: router.currentRoute.value.fullPath,
      query,
    });
  });

  async function onRequest(props) {
    const { page, rowsPerPage } = props.pagination;
    //sortBy, descending
    // const filter = props.filter;

    const query = Object.assign({}, route.query, {
      page,
      per_page: rowsPerPage,
    });

    router.push({
      path: router.currentRoute.value.fullPath,
      query,
    });

    loadingDepartment.value = true;

    const returnedData = await fetchFunc();
    pagination.value.rowsPerPage = returnedData.meta.per_page;
    pagination.value.page = returnedData.meta.current_page;
    pagination.value.rowsNumber = returnedData.meta.total;

    loadingDepartment.value = false;
  }

  return { onRequest, pagination };
}
