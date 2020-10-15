<template>
  <div class="product">
    <div class="pagebanner" :style="{backgroundImage: 'url(' + bannerImg + ')'}">
      <h2>{{ product.category }}</h2>
    </div>

    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb py-3">
          <li class="breadcrumb-item">
            <router-link to="/">
              首頁
            </router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'Products', query: { categoryName: product.category }}">
              {{ product.category }}
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ product.title }}
          </li>
        </ol>
      </nav>

      <div class="row mb-md-5">
        <div class="col-12 col-md-6  mb-4 mb-md-0">
          <div class="cover" v-if="product.imageUrl">
            <div class="cover-img" :style="{backgroundImage: 'url(' + product.imageUrl[0] + ')'}">
              <a href="#" class="favorite-icon favorite-icon-lg"
               @click.prevent="delFavoriteItem(product)"
                v-show="isFavorite">
                <i class="fas fa-heart"></i>

              </a>
              <a href="#" class="favorite-icon favorite-icon-lg"
               @click.prevent="addFavorite(product)"
                v-show="!isFavorite">
                <i class="far fa-heart"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-center">
            <h2 class="mb-2">{{ product.title }}</h2>
            <h3 class="product-category">{{ product.category }}</h3>
            <ul class="product-price" v-if="product.origin_price === product.price">
              <li class="price">售價： {{ product.origin_price | currency }}</li>
            </ul>
            <ul class="product-price" v-else>
              <li class="price price-through">售價： {{ product.origin_price | currency }}</li>
              <li class="price">特價： {{ product.price | currency }}</li>
            </ul>
            <div class="product-cart">
              <div class="counter">
                <a href="#" class="lessNum" @click.prevent="lessNum()">
                  <i class="fas fa-minus"></i>
                </a>
                <input type="number" min="1" readonly="readonly" class="counter-input"
                 v-model="counterNum">
                <a href="#" class="addNum" @click.prevent="counterNum += 1">
                  <i class="fas fa-plus"></i>
                </a>
              </div>

              <a href="#" class="btn btn-dark"
               @click.prevent="updateCartItem(product.id)">
                <span class="mr-1">
                  <i class="fas fa-shopping-basket"></i>
                </span>
                放入購物車
              </a>
            </div>
            <h4 class="product-subtitle">產品介紹</h4>
            <p class="product-text">
              {{ product.content }}
            </p>
            <h4 class="product-subtitle">產品成分</h4>
            <p class="product-text" v-if="product.options">
              {{ product.options.ingredient }}
            </p>
          </div>
        </div>
      </div>

      <h4 class="swiper-title">您可能會喜歡</h4>
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide v-for="item in relatedProducts" :key="item.id">
          <router-link :to="`/products/${item.id}`"
           :style="{backgroundImage: 'url(' + item.imageUrl[0] + ')'}" class="swipter-item">
            <span class="swipter-item-category">{{ item.title }}</span>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import bannerImgAllmenu from '@/assets/images/banner-allmenu.jpg';
import bannerImgMaintmeal from '@/assets/images/banner-mainmeal.jpg';
import bannerImgLightmeal from '@/assets/images/banner-lightmeal.jpg';
import bannerImgDessert from '@/assets/images/banner-dessert.jpg';
import bannerImgDrinks from '@/assets/images/banner-drinks.jpg';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  name: 'Product',
  data() {
    return {
      counterNum: 1,
      product: {},
      relatedProducts: [],
      carts: [],
      favorites: [],
      isFavorite: false,
      categoryName: '',
      bannerImg: '',
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
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 20,
            slidesPerGroup: 1,
          },
        },
      },
    };
  },
  methods: {
    lessNum() {
      if (this.counterNum > 2) {
        this.counterNum -= 1;
      } else {
        this.counterNum = 1;
      }
    },
    getRelated(category) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.get(url).then((res) => {
        vm.relatedProducts = res.data.data.filter((item) => item.category === category
        && item.id !== vm.product.id);

        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/product/${id}`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.get(url).then((res) => {
        vm.product = res.data.data;
        vm.$store.dispatch('updateLoading', false, { root: true });
        vm.getRelated(vm.product.category);
        vm.getFavorites();

        // 依分類設定封面圖
        vm.categories.forEach((item, index) => {
          if (item.title === vm.product.category) {
            vm.bannerImg = vm.categories[index].bannerImg;
          }
        });
      }).catch(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        vm.$swal({
          title: '錯誤',
          text: '找不到此商品',
          confirmButtonColor: '#dc3545',
          confirmButtonText: '確認',
          customClass: {
            title: 'swal-title swal-title-danger',
          },
        }).then(() => {
          vm.$router.push('/products');
        });
      });
    },
    getCarts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.get(url).then((res) => {
        vm.carts = res.data.data;
        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
    updateCartItem(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      let n = 0;
      let method = 'post';

      n = Number(vm.counterNum);

      const isInCart = vm.carts.filter((item) => item.product.id === id);

      if (isInCart.length > 0) {
        method = 'patch';
        n = Number(isInCart[0].quantity) + Number(vm.counterNum);
      }

      const data = {
        product: id,
        quantity: n,
      };
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http[method](url, data).then(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        vm.getCarts();
        vm.$emit('get-carts');

        const msg = {
          icon: 'success',
          title: '更新購物車成功',
        };
        vm.$bus.$emit('alertmessage', msg);
      }).catch(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });

        const msg = {
          icon: 'error',
          title: '更新購物車失敗',
        };
        vm.$bus.$emit('alertmessage', msg);
      });
    },
    getFavorites() {
      const vm = this;
      vm.favorites = JSON.parse(localStorage.getItem('favoriteData')) || [];

      // 查詢此商品是否在我的最愛中
      vm.isFavorite = false;
      vm.favorites.forEach((favoriteItem) => {
        if (vm.product.id === favoriteItem.id) {
          vm.isFavorite = true;
        }
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
      vm.$bus.$emit('alertmessage', msg);

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
      vm.$bus.$emit('alertmessage', msg);

      vm.$emit('get-favorites');
      vm.getFavorites();
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  created() {
    const id = this.$route.params.productId;
    this.getProduct(id);
    this.getCarts();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.product {
  min-height: calc(100vh - 3.5rem);
  padding-bottom: 3rem;
}

.pagebanner {
  margin-bottom: 2rem;
}

.cover {
  height: 100%;
  padding: 0 0 1.5rem 1.5rem;
}

.cover-img {
  position: relative;
  height: 100%;
  min-height: 15rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.25rem;
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 100%;
    height: 100%;
    background-color: $muted;
    border-radius: 0.25rem;
    z-index: -1;
  }
}

.product-category {
  margin-bottom: 1.5rem;
  color: $secondary;
  font-size: 1.25rem;
}

.product-price {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.price {
  font-size: 1.25rem;
}

.price-through {
  margin-right: 1rem;
  color: $primary;
  font-size: 1rem;
  text-decoration: line-through;
}

.product-cart {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-bottom: 2rem;
  @include mobile {
    flex-direction: row;
  }
}

.counter {
  margin: 0;
}

.product-subtitle {
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid $dark;
  text-align: left;
  font-size: 1.25rem;
}

.product-text {
  margin-bottom: 1.5rem;
  padding-bottom: 0;
  text-align: left;
  line-height: 1.75;
}

.swiper-title {
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid $dark;
  font-size: 1.25rem;
}

.swipter-item {
  display: block;
  position: relative;
  min-height: 10rem;
  margin: 0.5rem 0.25rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.25rem;
  transition: 0.5s all ease;
  &:hover, &:focus {
    box-shadow: 0px 0px 3px 4px $primary;
    .swipter-item-category {
      background-color: $dark;
    }
  }
}

.swipter-item-category {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.25rem;
  background-color: rgba($dark, 0.8);
  border-bottom-right-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  transition: 0.5s all ease;
  text-align: center;
  color: $white;
}
</style>
