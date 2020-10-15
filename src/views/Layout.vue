<template>
  <div>
    <AlertMessage/>

    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="header-wrap" :class="{'header-scroll': isMenuOpen || scrollHeader}">
      <div class="container header">
        <router-link to="/" class="header-logo">Adagio</router-link>

        <ul class="menu" :class="{'active': isMenuOpen}">
          <li>
            <router-link to="/" class="menu-link">
              首頁
            </router-link>
          </li>
          <li>
            <router-link to="/products" class="menu-link">
              產品列表
            </router-link>
          </li>
          <li>
            <router-link to="/about" class="menu-link">
              關於我們
            </router-link>
          </li>
          <li>
            <router-link to="/contact" class="menu-link">
              聯絡我們
            </router-link>
          </li>
        </ul>

        <ul class="header-toolbar">
          <li class="dropdown">
            <a href="#" class="toolbar-link" role="button" data-toggle="dropdown">
              <i class="fas fa-heart"></i>
              <span class="toolbar-num">{{ favoritesNum }}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right px-2">
              <h5 class="text-center">我的最愛</h5>
              <table class="table table-hover mb-1" style="min-width: 300px;">
                <tbody>
                  <tr v-for="favorite in favorites" :key="favorite.key">
                    <td class="p-0">
                      <router-link :to="`/products/${favorite.id}`" class="favorite-link">
                        <span class="toolbar-thumbnail mr-3"
                        :style="{backgroundImage: 'url(' + favorite.imageUrl + ')'}">
                        ></span>
                        <p class="mb-1">{{ favorite.title }}</p>
                      </router-link>
                    </td>
                    <td class="px-1 align-middle">
                      <a href="#" class="toolbar-delicon"
                        @click.prevent="delFavoriteItem(favorite)">
                        <i class="fas fa-times"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="!favoritesNum">
                <p class="mb-2 text-center text-muted" v-if="!favoritesNum">我的最愛是空的</p>
                <router-link to="/products" class="btn btn-block btn-dark">看更多商品</router-link>
              </div>

              <a href="#" class="btn btn-block btn-outline-danger"
               @click.prevent="delFavoriteAll()" v-else
               data-toggle="modal" data-target="#delModal"
              >
                全部清空
              </a>
            </div>
          </li>
          <li class="dropdown">
            <a href="#" class="toolbar-link" role="button" data-toggle="dropdown">
              <i class="fas fa-shopping-bag"></i>
              <span class="toolbar-num">{{ cartsNum }}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right px-2">
              <h5 class="text-center">購物車清單</h5>
              <table class="table mb-0" style="min-width: 300px;">
                <tbody>
                  <tr v-for="cart in carts" :key="cart.id">
                    <td>
                      <span class="toolbar-thumbnail mx-auto"
                       :style="{backgroundImage: 'url(' + cart.product.imageUrl[0] + ')'}">
                      ></span>
                    </td>
                    <td class="px-1 align-middle">
                      <p class="mb-1">{{ cart.product.title }}</p>
                      <p class="mb-0">
                        {{ cart.product.price | currency }} x {{ cart.quantity }}
                      </p>
                    </td>
                    <td class="px-1 align-middle">
                      <a href="#" class="toolbar-delicon"
                        @click.prevent="delCartItem(cart.product.id)">
                        <i class="fas fa-times"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="!cartsNum">
                <p class="mb-2 text-center text-muted">購物車是空的</p>
                <router-link to="/products" class="btn btn-block btn-dark">購物去</router-link>
              </div>

              <router-link to="/createorder" class="btn btn-block btn-dark" v-else>
                結帳去
              </router-link>
            </div>
          </li>
        </ul>

        <a href="#" class="menu-toggle" @click.prevent="isMenuOpen = !isMenuOpen">
          <span class="p-3" v-show="!isMenuOpen">
            <i class="fas fa-bars"></i>
          </span>
          <span class="p-3" v-show="isMenuOpen">
            <i class="fas fa-times"></i>
          </span>
        </a>
      </div>
    </div>

    <router-view @get-carts="getCarts" @get-favorites="getFavorites" :key="$route.fullPath"
     ref="view">
    </router-view>

    <div class="footer">
      ⓒ 2020 Adagio by Carol
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import AlertMessage from '../components/AlertMessage.vue';

export default {
  name: 'Layout',
  data() {
    return {
      scrollHeader: false,
      isMenuOpen: false,
      carts: [],
      cartsNum: 0,
      favorites: [],
      favoritesNum: 0,
    };
  },
  methods: {
    getCarts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.get(url).then((res) => {
        let num = 0;
        vm.carts = res.data.data;
        vm.carts.forEach((item) => {
          num += Number(item.quantity);
        });
        vm.cartsNum = num;
        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
    delCartItem(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping/${id}`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.delete(url, { product: id }).then(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        const msg = {
          icon: 'success',
          title: '已刪除此筆資料',
        };
        vm.$bus.$emit('alertmessage', msg);
        vm.getCarts();

        // 若在 checkorder 或 Products 或 Product 頁則重整內頁購物車
        const routerName = vm.$refs.view.$route.name;
        if (routerName === 'Products' || routerName === 'Product' || routerName === 'CreateOrder') {
          vm.$refs.view.getCarts();
        }
      }).catch(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        const msg = {
          icon: 'error',
          title: '刪除購物車失敗',
        };
        vm.$bus.$emit('alertmessage', msg);
      });
    },
    getFavorites() {
      const vm = this;
      vm.favorites = JSON.parse(localStorage.getItem('favoriteData')) || [];
      vm.favoritesNum = vm.favorites.length;
    },
    delFavoriteAll() {
      const vm = this;
      vm.$swal({
        title: '刪除我的最愛',
        text: '確定要刪除全部我的最愛 (刪除後無法復原)',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#343a40',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        customClass: {
          title: 'swal-title swal-title-danger',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('favoriteData');

          const msg = {
            icon: 'success',
            title: '已刪除全部我的最愛',
          };
          vm.$bus.$emit('alertmessage', msg);

          vm.getFavorites();

          // 若在 Products 或 Product 頁則重整內頁我的最愛
          const routerName = vm.$refs.view.$route.name;
          if (routerName === 'Products' || routerName === 'Product') {
            vm.$refs.view.getFavorites();
          }
        }
      });
    },
    delFavoriteItem(item) {
      const vm = this;
      vm.favorites.forEach((favoriteItem, index) => {
        if (favoriteItem.id === item.id) {
          vm.favorites.splice(index, 1);
        }
      });
      localStorage.setItem('favoriteData', JSON.stringify(vm.favorites));

      const msg = {
        icon: 'success',
        title: '已刪除我的最愛',
      };
      vm.$bus.$emit('alertmessage', msg);

      vm.getFavorites();

      // 若在 Products 或 Product 頁則重整內頁我的最愛
      const routerName = vm.$refs.view.$route.name;
      if (routerName === 'Products' || routerName === 'Product') {
        vm.$refs.view.getFavorites();
      }
    },
    scrollPage() {
      const vm = this;
      const scrollTop = $(window).scrollTop();
      const { path } = vm.$route;
      switch (true) {
        case path === '/' && scrollTop > 0:
          window.addEventListener('scroll', vm.scrollPage);
          vm.scrollHeader = true;
          break;
        case path === '/':
          window.addEventListener('scroll', vm.scrollPage);
          vm.scrollHeader = false;
          break;
        default:
          window.removeEventListener('scroll', vm.scrollPage);
          vm.scrollHeader = true;
          break;
      }
    },
  },
  computed: {
    ...mapGetters(['isLoading']),
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        const vm = this;
        vm.scrollPage();
        vm.isMenuOpen = false;
      }
    },
  },
  components: {
    AlertMessage,
  },
  created() {
    const vm = this;
    vm.getCarts();
    vm.getFavorites();
    vm.scrollPage();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.header-wrap {
  position: fixed;
  width: 100%;
  background-color: transparent;
  transition: 0.25s ease all;
  z-index: 999;
}

.header-scroll {
  background-color: $dark;
  .header-logo {
    font-size: 2rem;
  }
}

.header {
  display: flex;
  align-items: center;
  a:hover {
    text-decoration: none;
  }
}

.header-logo {
  margin-right: auto;
  font-family: $font-logo;
  transition: 0.25s ease all;
  color: $white;
  font-size: 2.25rem;
  &:hover {
    color: $white;
  }
}

.menu {
  position: absolute;
  top: 3.5rem;
  right: 0;
  left: 0;
  max-height: 0;
  background-color: $dark;
  transition: 0.5s all ease-in;
  text-align: center;
  overflow: hidden;
  @include desktop {
    display: flex;
    position: relative;
    top: auto;
    max-height: 3.5rem;
    background-color: transparent;
    transition: none;
  }
  &.active {
    max-height: 14.5rem;
  }
}

.menu-link {
  display: block;
  padding: 1rem;
  border-top: 1px solid $muted;
  color: $white;
  @include desktop {
    border-top: none;
  }
  &:hover {
    color: $warning;
  }
  &.active {
    background-color: lighten($dark, 20%);
    @include desktop {
      background-color: transparent;
      color: darken($white, 30%);
    }
    &:hover {
      color: darken($white, 20%);
    }
  }
}

.menu-toggle {
  max-width: 2.5rem;
  color: $white;
  &:hover {
    color: $secondary;
  }
  @include desktop {
    display: none;
  }
}

.header-toolbar {
  display: flex;
  align-items: center;
}

.toolbar-link {
  padding: 1rem 0 1rem 1rem;
  color: $white;
  &:hover, &:focus {
    color: $warning;
  }
}

.toolbar-thumbnail {
  display: inline-block;
  width: 3.5rem;
  height: 3.5rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.toolbar-num {
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.toolbar-delicon {
  padding: 0.5rem;
  color: lighten($danger, 20%);
  &:hover {
    color: $danger;
  }
}

.favorite-link {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: $dark;
  &:hover {
    color: $dark;
  }
}

.footer {
  padding: 0.75rem;
  background-color: $dark;
  text-align: center;
  color: $white;
}

</style>
