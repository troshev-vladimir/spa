import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

export default function usePagination(fetchFunc, loadingDepartment) {
  const router = useRouter();
  const route = useRoute();
  const $q = useQuasar();

  const pagination = ref({
    sortBy: null,
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  });

  onMounted(() => {
    const query = Object.assign({}, route.query, {
      page: route.query.page ? route.query.page : pagination.value.page,
      per_page: route.query.per_page ? route.query.per_page : pagination.value.rowsPerPage,
    });

    router.replace({
      path: router.currentRoute.value.fullPath,
      query,
    });
  });

  async function onRequest(props) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;

    const query = Object.assign({}, route.query, {
      page,
      per_page: rowsPerPage,
      sortBy,
      desc: descending,
    });

    await router.push({
      path: router.currentRoute.value.fullPath,
      query,
    });

    loadingDepartment.value = true;

    try {
      const returnedData = await fetchFunc();
      console.log(returnedData.meta);
      pagination.value.rowsPerPage = returnedData.meta.per_page;
      pagination.value.page = returnedData.meta.current_page;
      pagination.value.rowsNumber = returnedData.meta.total;
    } catch (error) {
      $q.notify({
        type: "positive",
        message: error,
      });
    }

    loadingDepartment.value = false;
  }

  return { onRequest, pagination };
}
