<template>
  <div>
    <AlertMessage/>

    <!-- loading 效果 -->
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="header">
      <a href="#" class="menu-toggle " @click.prevent="isMenuOpen = !isMenuOpen">Menu</a>

      <ul class="menu-collapse" :class="{'active': isMenuOpen}">
        <li>
          <router-link to="/" class="header-link">首頁</router-link>
        </li>
        <li>
          <router-link to="/about" class="header-link">關於我們</router-link>
        </li>
        <li>
          <router-link to="/products" class="header-link">產品列表</router-link>
        </li>
      </ul>

      <router-link to="/" class="header-logo">Adagio</router-link>

      <ul class="header-list">
        <li class="dropdown">
          <a href="#" class="header-link cart" role="button" data-toggle="dropdown">
            <i class="fas fa-shopping-bag fa-lg"></i>
            <span class="cart-num">( {{ cartsNum }} )</span>
          </a>
          <div class="dropdown-menu dropdown-menu-right px-2">
            <h5 class="text-center">購物車清單</h5>
            <table class="table mb-0" style="min-width: 300px;">
              <tbody>
                <tr v-for="cart in carts" :key="cart.id">
                  <td>
                    <a href="#" class="text-danger" @click.prevent="openDelModal(cart.product.id)">
                      <i class="far fa-trash-alt"></i>
                    </a>
                  </td>
                  <td class="px-1">
                    {{ cart.product.title }}
                  </td>
                  <td class="px-1">
                    {{ cart.quantity }} 件
                  </td>
                  <td class="px-1 text-right">
                    {{ cart.product.price | currency }}
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="mb-0 text-center" v-if="!cartsNum">購物車是空的</p>

            <router-link to="/createorder" class="btn btn-block btn-dark" v-else>
              結帳去
            </router-link>
          </div>
        </li>
        <li>
          <router-link to="/login" class="header-link">
            <i class="fas fa-user fa-lg"></i>
          </router-link>
        </li>
      </ul>
    </div>

    <router-view @get-carts="getCarts" :key="$route.fullPath" ref="view"></router-view>

    <div class="footer">
      ⓒ 2020 Adagio by Carol
    </div>

  </div>
</template>

<script>
import AlertMessage from '../components/AlertMessage.vue';

export default {
  name: 'Layout',
  data() {
    return {
      isLoading: false,
      isMenuOpen: false,
      carts: [],
      cartsNum: 0,
      tempData: {},
    };
  },
  methods: {
    getCarts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.carts = res.data.data;
        vm.cartsNum = vm.carts.length;
        vm.isLoading = false;
      });
    },
    openDelModal(id) {
      const vm = this;
      vm.$swal({
        title: '刪除購物車商品',
        text: '確定要刪除購物車內該筆商品 (刪除後無法復原)',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        allowOutsideClick: false,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.isConfirmed) {
          vm.delCartItem(id);
        }
      });
    },
    delCartItem(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping/${id}`;
      vm.isLoading = true;
      vm.$http.delete(url, { product: id }).then(() => {
        const msg = {
          icon: 'success',
          title: '已刪除此筆資料',
        };
        vm.$bus.$emit('alertmessage', msg);

        vm.getCarts();

        // 若在 checkorder 頁則重整內頁購物車
        if (vm.$refs.view.$route.name === 'CreateOrder') {
          vm.$refs.view.getCarts();
        }
      }).catch(() => {
        const msg = {
          icon: 'error',
          title: '刪除購物車失敗',
        };
        vm.$bus.$emit('alertmessage', msg);

        vm.isLoading = false;
      });
    },
  },
  components: {
    AlertMessage,
  },
  created() {
    const vm = this;
    vm.getCarts();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/all';

.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  background-color: $dark;
  text-align: center;
  a:hover {
    text-decoration: none;
  }
}

.header-logo {
  padding: 0.25rem;
  font-family: $font-logo;
  font-size: 1.75rem;
}

.header-list {
  flex: 0 0 33.33333%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-link {
  padding: 1rem;
  &.active {
    color: darken($primary, 15%);
  }
}

.menu-collapse {
  position: absolute;
  top: 3.25rem;
  right: 0;
  left: 0;
  max-height: 0;
  overflow: hidden;
  background-color: $dark;
  transition: 0.5s all ease-in;
  text-align: center;
  z-index: 999;
  @include desktop {
    flex: 0 0 33.33333%;
    display: flex;
    position: relative;
    top: auto;
    max-height: 3.25rem;
  }
  &.active {
    max-height: 10.5rem;
    transition: 0.5s all ease-in;
  }
}

.menu-toggle {
  flex: 0 0 33.33333%;
  display: block;
  padding: 0.5rem 1rem;
  text-align: left;
  @include desktop {
    display: none;
  }
}

.cart {
  position: relative;
  margin-right: 0.75rem;
}

.cart-num {
  position: absolute;
  top: 0.4rem;
  font-size: 0.75rem;
  white-space:nowrap;
}

.footer {
  background-color: $dark;
  padding: 0.75rem;
  text-align: center;
  color: $white;
}

</style>
