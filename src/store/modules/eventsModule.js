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
    async fetchAllEvents({ commit }, payload) {
      try {
        const result = await eventsService.getAll(payload);
        commit("setEvents", result.data);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchTypes({ commit }) {
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
