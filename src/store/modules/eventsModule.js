import eventsService from "@/api/events";

const events = {
  namespaced: true,

  state: () => ({
    eventsData: [],
    eventTypes: [],
  }),
  mutations: {
    setEvents(state, arr) {
      state.eventsData = arr;
    },

    setTypes(state, arr) {
      state.eventTypes = arr;
    },
  },
  actions: {
    async fetchAllEvents({ commit, rootState }, payload) {
      try {
        const result = await eventsService.getAll(rootState.department.id, payload);
        commit("setEvents", result.data);
        return result;
      } catch (error) {
        throw error.response.data;
      }
    },
    async fetchTypes({ commit, state }) {
      if (state.eventTypes.length) return;
      try {
        const result = await eventsService.getAllTypes();
        commit("setTypes", result);
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default events;
