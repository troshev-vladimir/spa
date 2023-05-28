import { onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";

export default function useFilter(filters) {
  const router = useRouter();
  const route = useRoute();

  async function resetAllFilters() {
    Object.keys(filters).forEach(
      (el) =>
        (filters[el] =
          typeof filters[el] === "object" && filters[el] !== null
            ? {
                from: null,
                to: null,
              }
            : "")
    );

    await nextTick();

    const newQuery = _.pickBy(route.query, (el, key) => {
      if (key.includes("From") || key.includes("To")) {
        let filter = key.replace("From", "").replace("To", "");
        console.log(filter);
        return !Object.keys(filters).includes(filter && filter + "Date");
      }

      return !Object.keys(filters).includes(key);
    });
    router.replace({
      path: route.path,
      query: newQuery,
    });
  }
  async function clearHandler(e) {
    const newQuery = _.pickBy(route.query, (el, key) => {
      return key !== e;
    });
    await nextTick();
    router.replace({
      path: route.path,
      query: newQuery,
    });
  }
  onMounted(() => {
    const itsFilters = Object.keys(filters);
    const searchParams = new URLSearchParams(router.currentRoute.value.query);
    searchParams.forEach((value, key) => {
      if (itsFilters.includes(key)) {
        if (key === "division_id") {
          filters[key] = Number(value);
          return;
        }
        filters[key] = Number(value) ? Number(value) : value;
      }
    });
  });
  // watch(
  //   filters,
  //   () => {
  //     const preparedFilters = Object.assign({}, allFilters);
  //     preparedFilters.createdFrom = createdDate.from;
  //     preparedFilters.createdTo = createdDate.to;
  //     preparedFilters.placementFrom = placementDate.from;
  //     preparedFilters.placementTo = placementDate.to;
  //     preparedFilters.payedFrom = payedDate.from;
  //     preparedFilters.payedTo = payedDate.to;
  //     router.push({
  //       path: router.currentRoute.value.fullPath,
  //       query: { ...route.query, ..._.pickBy(preparedFilters, _.identity) },
  //     });
  //   },
  //   { deep: true }
  // );

  return {
    resetAllFilters,
    clearHandler,
  };
}
