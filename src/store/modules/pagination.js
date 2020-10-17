export default ({
  namespaced: true,
  state: {
    pagination: {
      perpage: 6, // 一面有幾個商品
      result_length: 0, // 商品數量
      total_pages: 1, // 總共有幾頁
      current_page: 1, // 所在頁面
    },
  },
  actions: {
    getPagination(context, { routerName, data }) {
      if (routerName !== 'Products') {
        context.commit('PAGINATION', data.meta.pagination);
      } else {
        context.commit('UPDATE_PAGINATION', data);
      }
    },
    updatePagination(context, data) {
      context.commit('UPDATE_PAGINATION', data);
    },
    updateCurrentPage(context, page) {
      context.commit('UPDATE_CURRENT_PAGE', page);
    },
  },
  mutations: {
    PAGINATION(state, payload) {
      state.pagination = payload;
    },
    UPDATE_PAGINATION(state, payload) {
      const resultLen = Number(payload.length);
      const perpage = 6;
      let totalPages = 1;
      if (resultLen) {
        totalPages = Math.ceil(resultLen / Number(perpage));
      }

      state.pagination = {
        perpage: 6,
        result_length: 0,
        total_pages: totalPages,
        current_page: 1,
      };
    },
    UPDATE_CURRENT_PAGE(state, payload) {
      state.pagination.current_page = payload;
    },
  },
  getters: {
    pagination: (state) => state.pagination,
  },
});
