import Vue from 'vue';
import Vuex from 'vuex';

import alertMessageModules from './modules/alertMessage';
import paginationModules from './modules/pagination';
import cartModules from './modules/cart';
import favoriteModules from './modules/favorite';
import productsModules from './modules/products';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false,
  },
  actions: {
    updateLoading(context, status) {
      context.commit('LOADING', status);
    },
  },
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    },
  },
  getters: {
    isLoading: (state) => state.isLoading,
  },
  modules: {
    alertMessageModules,
    paginationModules,
    cartModules,
    productsModules,
    favoriteModules,
  },
});
