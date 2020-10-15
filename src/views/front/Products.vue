<template>
  <div class="products-wrap">
    <div class="pagebanner" :style="{backgroundImage: 'url(' + bannerImg + ')'}">
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
             v-for="product in filterData" :key="product.id">
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
            <Pagination :pages="pagination" @get-data="changePage"/>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Pagination from '@/components/Pagination.vue';
import bannerImgAllmenu from '@/assets/images/banner-allmenu.jpg';
import bannerImgMaintmeal from '@/assets/images/banner-mainmeal.jpg';
import bannerImgLightmeal from '@/assets/images/banner-lightmeal.jpg';
import bannerImgDessert from '@/assets/images/banner-dessert.jpg';
import bannerImgDrinks from '@/assets/images/banner-drinks.jpg';

export default {
  name: 'Products',
  data() {
    return {
      // 頁面相關
      currentPage: 1, // 所在頁面
      pagination: {
        perpage: 6, // 一面有幾個商品
        result_length: 0, // 商品數量
        total_pages: 1, // 總共有幾頁
        current_page: 1, // 所在頁面
      },
      products: [],
      favorites: {},
      searchText: '',
      filterText: '',
      filterCategory: '全部',
      bannerImg: bannerImgAllmenu,
      categories: [
        {
          title: '全部',
          bannerImg: bannerImgAllmenu,
        },
        {
          title: '主餐',
          bannerImg: bannerImgMaintmeal,
        },
        {
          title: '輕食',
          bannerImg: bannerImgLightmeal,
        },
        {
          title: '甜點',
          bannerImg: bannerImgDessert,
        },
        {
          title: '飲品',
          bannerImg: bannerImgDrinks,
        },
      ],
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.get(url).then((res) => {
        vm.products = res.data.data;

        // 設定預設頁碼
        const resultLen = vm.products.length;
        vm.pagination = {
          perpage: 6, // 一面有幾個商品
          result_length: resultLen,
          total_pages: Math.ceil(resultLen / Number(vm.pagination.perpage)),
          current_page: 1,
        };

        vm.getQuery();
        vm.getFavorites();

        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
    updateCartItem(id, num) {
      const vm = this;
      let n = 0;
      let method = 'post';

      n = Number(num);

      const isInCart = vm.carts.filter((item) => item.product.id === id);

      if (isInCart.length > 0) {
        method = 'patch';
        n = Number(isInCart[0].quantity) + Number(num);
      }

      vm.$store.dispatch('cartModules/updateCartItem', { id, num: n, method });
    },
    getFavorites() {
      const vm = this;
      vm.favorites = JSON.parse(localStorage.getItem('favoriteData')) || [];

      // 查詢各商品是否有在我的最愛中，有則加入 isFavorite:true，否則加入 isFavorite:false
      vm.products.forEach((productItem, index) => {
        vm.$set(vm.products[index], 'isFavorite', false);
        vm.favorites.forEach((favoriteItem) => {
          if (productItem.id === favoriteItem.id) {
            vm.$set(vm.products[index], 'isFavorite', true);
          }
        });
      });
    },
    addFavorite(item) {
      const vm = this;
      const favoriteData = {
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl[0],
      };
      vm.favorites.push(favoriteData);
      localStorage.setItem('favoriteData', JSON.stringify(vm.favorites));

      const msg = {
        icon: 'success',
        title: '已加入我的最愛',
      };
      vm.$store.dispatch('alertMessageModules/openToast', msg);

      vm.$emit('get-favorites');
      vm.getFavorites();
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
      vm.$store.dispatch('alertMessageModules/openToast', msg);

      vm.$emit('get-favorites');
      vm.getFavorites();
    },
    getQuery() {
      const vm = this;
      const { categoryName } = vm.$route.query;
      if (categoryName) {
        vm.filterCategory = categoryName;
        vm.categories.forEach((item, index) => {
          if (item.title === vm.filterCategory) {
            vm.bannerImg = vm.categories[index].bannerImg;
          }
        });
      }
    },
    getCategory(category) {
      const vm = this;
      vm.filterCategory = category.title;

      // 切換分類，更換封面圖
      vm.categories.forEach((item, index) => {
        if (item.title === vm.filterCategory) {
          vm.bannerImg = vm.categories[index].bannerImg;
        }
      });

      // 切換分類，所在頁面變為第一頁
      vm.currentPage = 1;
      vm.pagination.current_page = 1;

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
      this.currentPage = currentPage;
      this.pagination.current_page = Number(currentPage);
    },
    ...mapActions('cartModules', ['getCarts']),
  },
  computed: {
    filterData() {
      const vm = this;
      const data = [];
      let newProducts = vm.products;

      // 有搜尋字串
      if (vm.filterText) {
        vm.filterCategory = '全部';
        newProducts = vm.products.filter((item) => item.title.indexOf(vm.filterText) !== -1);
      }
      // 分類不為全部
      if (vm.filterCategory !== '全部') {
        newProducts = vm.products.filter((item) => item.category === vm.filterCategory);
      }

      // 當前顯示頁面資料、設定頁碼資訊
      const resultLen = Number(newProducts.length);
      const perpage = Number(vm.pagination.perpage);
      vm.pagination.result_length = resultLen;
      vm.pagination.total_pages = Math.ceil(resultLen / perpage);

      // 此頁碼最小資料為第?筆
      const minItem = (vm.currentPage * perpage) - perpage + 1;

      // 此頁碼最大資料為第?筆
      const maxItem = vm.currentPage * perpage;

      // 只取當前頁面資料
      newProducts.forEach((item, i) => {
        // 配合  minItem 及  maxItem 從 1 開始，所以 +1
        const itemNum = i + 1;
        // 每頁 6 筆，以第 2 頁為例，只取第 7~12 筆
        if (itemNum >= minItem && itemNum <= maxItem) {
          data.push(item);
        }
      });
      newProducts = data;

      return newProducts;
    },
    ...mapGetters('cartModules', ['carts']),
  },
  components: {
    Pagination,
  },
  created() {
    this.getProducts();
    this.$store.dispatch('cartModules/getCarts');
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
  transition: 0.5s all ease;
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
