export default ({
  namespaced: true,
  state: {
    favorites: [],
    favoritesNum: 0,
  },
  actions: {
    getFavorites(context) {
      const favoriteData = JSON.parse(localStorage.getItem('favoriteData')) || [];

      context.commit('FAVORITES', favoriteData);
      context.commit('FAVORITES_NUM', favoriteData.length);
    },
    addFavorite(context, item) {
      const favoriteData = {
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl[0],
      };
      context.commit('PUSH_FAVORITE', favoriteData);
      localStorage.setItem('favoriteData', JSON.stringify(context.state.favorites));
      context.dispatch('getFavorites');
      const msg = {
        icon: 'success',
        title: '已加入我的最愛',
      };
      context.dispatch('alertMessageModules/openToast', msg, { root: true });
    },
    delFavoriteItem(context, item) {
      context.commit('REMOVE_FAVORITE', item);
      localStorage.setItem('favoriteData', JSON.stringify(context.state.favorites));
      context.dispatch('getFavorites');
      const msg = {
        icon: 'success',
        title: '已刪除我的最愛',
      };
      context.dispatch('alertMessageModules/openToast', msg, { root: true });
    },
    delFavoriteAll(context) {
      localStorage.removeItem('favoriteData');
      context.dispatch('getFavorites');
      const msg = {
        icon: 'success',
        title: '已刪除全部我的最愛',
      };
      context.dispatch('alertMessageModules/openToast', msg, { root: true });
    },
  },
  mutations: {
    FAVORITES(state, payload) {
      state.favorites = payload;
    },
    FAVORITES_NUM(state, payload) {
      state.favoritesNum = payload;
    },
    PUSH_FAVORITE(state, favorite) {
      state.favorites.push(favorite);
    },
    REMOVE_FAVORITE(state, favorite) {
      state.favorites.forEach((item, index) => {
        if (item.id === favorite.id) {
          state.favorites.splice(index, 1);
        }
      });
    },
  },
  getters: {
    favorites: (state) => state.favorites,
    favoritesNum: (state) => state.favoritesNum,
  },
});
