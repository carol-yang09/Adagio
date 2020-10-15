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

      if (num <= 0) {
        const msg = {
          icon: 'error',
          title: '商品數量必須大於 1 樣',
        };
        context.dispatch('alertMessageModules/openToast', msg, { root: true });
      } else {
        const data = {
          product: id,
          quantity: num,
        };
        context.commit('LOADING', true, { root: true });

        axios[method](url, data).then(() => {
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
      }
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
