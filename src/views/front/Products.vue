<template>
  <div class="products-wrap">
    <div class="pagebanner" :style="{backgroundImage: 'url(' + categoryImg + ')'}">
      <h2>產品列表</h2>
    </div>

    <div class="container-fluid products">
      <div class="row">

        <div class="col-12 col-md-5 col-lg-3">

          <div class="categories">
            <h3 class="categories-title">產品分類</h3>
              <ul class="categories-list">
              <li v-for="category in categories" :key="category.key"
               :class="{'active': category.title === filterCategory}">
                <a href="#" class="categories-link"
                 @click.prevent="getCategory(category)">
                  {{ category.title }}
                </a>
              </li>
            </ul>
          </div>

          <div class="input-group search-inputgroup">
            <input type="text" class="form-control" placeholder="請輸入搜尋商品"
             v-model.trim="searchText" @keyup.enter="search()">
            <div class="input-group-append">
              <button class="btn btn-dark rounded-right" type="button"
               @click.prevent="search()">
                搜尋
              </button>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-7 col-lg-9">

          <div class="products-info" v-if="filterText">
            搜尋到 {{ filterData.length }} 筆 "{{ filterText }}" 資料
          </div>

          <div class="row">
            <div class="col-12 col-lg-6 col-xl-4"
             v-for="product in filterData"
              :key="product.id">
              <router-link :to="`/products/${product.id}`" class="card">
                <div class="card-head">
                  <div class="card-img-wrap">
                    <span class="card-img"
                     :style="{backgroundImage: 'url(' + product.imageUrl[0] + ')'}">
                    </span>
                  </div>
                  <div class="card-category">{{ product.category }}</div>
                  <a href="#" class="favorite-icon" @click.prevent="delFavoriteItem(product)"
                   v-show="product.isFavorite">
                   <i class="fas fa-heart"></i>

                  </a>
                  <a href="#" class="favorite-icon" @click.prevent="addFavorite(product)"
                   v-show="!product.isFavorite">
                    <i class="far fa-heart"></i>
                  </a>
                </div>
                <div class="card-body text-center">
                  <h4 class="card-title">{{ product.title }}</h4>
                  <ul class="card-price" v-if="product.origin_price === product.price">
                    <li class="price">
                      售價： {{ product.origin_price | currency }}
                    </li>
                  </ul>
                  <ul class="card-price" v-else>
                    <li class="price price-through">
                      售價： {{ product.origin_price | currency }}
                    </li>
                    <li class="price">
                      特價： {{ product.price | currency }}
                    </li>
                  </ul>
                  <a href="#" class="btn btn-dark btn-sm card-btn"
                   @click.prevent="updateCartItem(product.id, 1)">
                    <span class="mr-1">
                      <i class="fas fa-shopping-basket"></i>
                    </span>
                    放入購物車
                  </a>
                </div>
              </router-link>
            </div>
          </div>

          <div class="products-pagination">
            <Pagination @get-data="changePage"/>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'Products',
  data() {
    return {
      searchText: '',
      filterText: '',
      filterCategory: '全部',
    };
  },
  methods: {
    updateCartItem(id, num) {
      this.$store.dispatch('cartModules/updateCartItem', { id, num, method: 'add' });
    },
    getData() {
      const { categoryName } = this.$route.query;
      this.$store.dispatch('favoriteModules/getFavorites')
        .then(() => this.$store.dispatch('productsModules/getProducts', { routerName: this.$route.name }))
        .then(() => {
          if (categoryName) {
            this.getCategory({ title: categoryName });
          } else {
            this.$store.dispatch('paginationModules/getPagination', { routerName: this.$route.name, data: this.products });
          }
        });
    },
    addFavorite(item) {
      this.$store.dispatch('favoriteModules/addFavorite', item)
        .then(() => {
          this.$store.dispatch('productsModules/getProducts', { routerName: this.$route.name });
        });
    },
    delFavoriteItem(item) {
      this.$store.dispatch('favoriteModules/delFavoriteItem', item)
        .then(() => {
          this.$store.dispatch('productsModules/getProducts', { routerName: this.$route.name });
        });
    },
    getCategory(category) {
      const vm = this;
      vm.filterCategory = category.title;

      // 切換分類，更換封面圖
      vm.$store.dispatch('productsModules/updateCategoryImg', vm.filterCategory);

      // 切換分類，更新頁碼資訊
      vm.$store.dispatch('paginationModules/updatePagination', vm.newProducts);

      // 切換分類，清除搜尋
      if (vm.filterText) {
        vm.filterText = '';
      }
    },
    search() {
      const vm = this;
      if (vm.searchText) {
        vm.filterCategory = '全部';
        vm.filterText = vm.searchText;

        // 切換分類，更新頁碼資訊
        vm.$store.dispatch('paginationModules/updatePagination', vm.newProducts);

        vm.searchText = '';
      } else {
        const msg = {
          title: '請輸入搜尋文字',
          text: '搜尋內容為空，請輸入搜尋文字',
          status: 'danger',
        };
        vm.$store.dispatch('alertMessageModules/openModal', msg);
      }
    },
    changePage(currentPage) {
      this.$store.dispatch('paginationModules/updateCurrentPage', currentPage);
    },
    ...mapActions('cartModules', ['getCarts']),
  },
  computed: {
    newProducts() {
      const vm = this;

      // 有搜尋字串
      if (vm.filterText) {
        vm.filterCategory = '全部';
        return vm.products.filter((item) => item.title.indexOf(vm.filterText) !== -1);
      }
      // 分類不為全部
      if (vm.filterCategory !== '全部') {
        return vm.products.filter((item) => item.category === vm.filterCategory);
      }
      return vm.products;
    },
    filterData() {
      const vm = this;
      const data = [];

      // 顯示當前頁面資料
      const perpage = Number(vm.pagination.perpage);
      const currentPage = Number(vm.pagination.current_page);

      // 取此頁碼最大及最小資料為第?筆
      const minItem = (currentPage * perpage) - perpage + 1;
      const maxItem = currentPage * perpage;

      vm.newProducts.forEach((item, i) => {
        const itemNum = i + 1;
        if (itemNum >= minItem && itemNum <= maxItem) {
          data.push(item);
        }
      });
      return data;
    },
    ...mapGetters('cartModules', ['carts']),
    ...mapGetters('productsModules', ['products', 'categories', 'categoryImg']),
    ...mapGetters('favoriteModules', ['favorites']),
    ...mapGetters('paginationModules', ['pagination']),
  },
  components: {
    Pagination,
  },
  created() {
    this.$store.dispatch('cartModules/getCarts');
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.products-wrap {
  min-height: calc(100vh - 3.5rem);
}

.pagebanner {
  margin-bottom: 3.5rem;
}

.products {
  padding: 0 2rem;
}

.search-inputgroup {
  margin-bottom: 2rem;
  button {
    padding: 0.25rem 2rem;
  }
  input {
    height: auto;
    padding: 0.5rem 1rem;
    border-color: $dark;
  }
}

.categories {
  margin-bottom: 2rem;
  border-radius: 0.25rem;
  text-align: center;
}

.categories-title {
  margin-bottom: 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid $dark;
  font-size: 1.25rem;
}

.categories-list {
  padding: 1rem 1rem 1.5rem;
  background-color: $light;
  .active a {
    background-color: $dark;
    border-color: $dark;
    color: $white;
    &:hover {
      background-color: lighten($dark, 10%);
    }
  }
}

.categories-link {
  display: block;
  padding: 0.5rem 0;
  border-bottom: 1px solid $muted;
  color: $dark;
  font-size: 1rem;
  &:hover {
    background-color: $primary;
    border-color: $primary;
    color: $white;
    text-decoration: none;
  }
}

.products-info {
  margin-bottom: 2rem;
}

.card {
  margin-bottom: 2rem;
  transition: 0.5s all ease;
  color: $dark;
  &:hover {
    box-shadow: 1px 2px 11px lighten($primary, 20%);
    color: $dark;
    text-decoration: none;
    .card-img {
      transform: scale(1.05);
    }
  }
}

.card-head {
  position: relative;
  margin-bottom: 0.25rem;
}

.card-img-wrap {
  overflow: hidden;
}

.card-img {
  display: block;
  width: 100%;
  min-height: 10rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s all ease;
}

.card-category {
  position: absolute;
  bottom: -1rem;
  left: 45%;
  padding: 0.25rem 0.5rem;
  background-color: $dark;
  border-radius: 0.25rem;
  color: $white;
}

.card-price {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.75rem;
}

.price {
  font-size: 1.25rem;
}

.price-through {
  margin-right: 2rem;
  color: $primary;
  font-size: 1rem;
  text-decoration: line-through;
}

.card-btn:hover {
  background-color: $secondary;
  border-color: $secondary;
}

.products-pagination {
  margin: 0 auto 3rem;
}
</style>
