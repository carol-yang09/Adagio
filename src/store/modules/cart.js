import axios from 'axios';

export default ({
  namespaced: true,
  state: {
    carts: {},
    cartsNum: 0,
    totalMoney: 0,
  },
  actions: {
    getCarts(context) {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      let num = 0;
      let total = 0;
      context.commit('LOADING', true, { root: true });
      axios.get(url).then((res) => {
        context.commit('CARTS', res.data.data);

        context.state.carts.forEach((item) => {
          num += Number(item.quantity);
          const price = item.product.price * item.quantity;
          total += price;
        });
        context.commit('CARTS_NUM', num);
        context.commit('TOTAL_MONEY', total);
        context.commit('LOADING', false, { root: true });
      });
    },
    updateCartItem(context, { id, num, method }) {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      let n = Number(num);
      let httpMethod = 'post';

      const isInCart = context.state.carts.filter((item) => item.product.id === id);

      switch (true) {
        case method === 'set':
          httpMethod = 'patch';
          break;
        case isInCart.length > 0:
          httpMethod = 'patch';
          n += Number(isInCart[0].quantity);
          break;
        default:
          break;
      }

      const data = {
        product: id,
        quantity: n,
      };
      context.commit('LOADING', true, { root: true });

      axios[httpMethod](url, data).then(() => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('getCarts');
        const msg = {
          icon: 'success',
          title: '更新購物車成功',
        };
        context.dispatch('alertMessageModules/openToast', msg, { root: true });
      }).catch(() => {
        context.commit('LOADING', false, { root: true });
        const msg = {
          icon: 'error',
          title: '更新購物車失敗',
        };
        context.dispatch('alertMessageModules/openToast', msg, { root: true });
      });
    },
    delCartItem(context, id) {
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping/${id}`;

      context.commit('LOADING', true, { root: true });
      axios.delete(url, { product: id }).then(() => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('getCarts');
        const msg = {
          icon: 'success',
          title: '已刪除此筆資料',
        };
        context.dispatch('alertMessageModules/openToast', msg, { root: true });
      }).catch(() => {
        context.commit('LOADING', false, { root: true });
        const msg = {
          icon: 'error',
          title: '刪除購物車失敗',
        };
        context.dispatch('alertMessageModules/openToast', msg, { root: true });
      });
    },
  },
  mutations: {
    CARTS(state, payload) {
      state.carts = payload;
    },
    CARTS_NUM(state, payload) {
      state.cartsNum = payload;
    },
    TOTAL_MONEY(state, payload) {
      state.totalMoney = payload;
    },
  },
  getters: {
    carts: (state) => state.carts,
    cartsNum: (state) => state.cartsNum,
    totalMoney: (state) => state.totalMoney,
  },
});
