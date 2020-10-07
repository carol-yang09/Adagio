<template>
  <div class="product">
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="pagebanner"></div>

    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
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
                <a href="#" class="addNum" @click.prevent="num += 1">
                  <i class="fas fa-plus"></i>
                </a>
                <input type="number" min="0" max="10" readonly="readonly" class="counter-input"
                 v-model="num">
                <a href="#" class="lessNum" @click.prevent="lessNum()">
                  <i class="fas fa-minus"></i>
                </a>
              </div>

              <a href="#" class="btn btn-dark" @click.prevent="updateCartItem(product.id)">
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
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  name: 'Product',
  data() {
    return {
      isLoading: false,
      categoryName: '',
      product: {},
      relatedProducts: [],
      carts: [],
      num: 1,
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
      if (this.num > 2) {
        this.num -= 1;
      } else {
        this.num = 1;
      }
    },
    getRelated(category) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.relatedProducts = res.data.data.filter((item) => item.category === category
        && item.id !== vm.product.id);

        vm.isLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/product/${id}`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.product = res.data.data;
        vm.getRelated(vm.product.category);
      });
    },
    getCarts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.carts = res.data.data;
        vm.isLoading = false;
      });
    },
    updateCartItem(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      let n = 0;
      let method = 'post';

      n = Number(vm.num);

      const isInCart = vm.carts.filter((item) => item.product.id === id);

      if (isInCart.length > 0) {
        method = 'patch';
        n = Number(isInCart[0].quantity) + Number(vm.num);
      }

      const data = {
        product: id,
        quantity: n,
      };
      vm.isLoading = true;
      vm.$http[method](url, data).then(() => {
        vm.getCarts();
        vm.$emit('get-carts');

        const msg = {
          icon: 'success',
          title: '更新購物車成功',
        };
        vm.$bus.$emit('alertmessage', msg);
      }).catch(() => {
        vm.isLoading = false;

        const msg = {
          icon: 'error',
          title: '更新購物車失敗',
        };
        vm.$bus.$emit('alertmessage', msg);
      });
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

.breadcrumb-item a {
  color: darken($light, 20%);
}

.product {
  min-height: calc(100vh - 3.5rem - 3rem - 15rem);
  padding-bottom: 3rem;
  @include pad {
    min-height: calc(100vh - 3.5rem - 3rem - 20rem);
  }
}

.pagebanner {
  min-height: 15rem;
  margin-bottom: 1.5rem;
  background: url('../../assets/images/pagebanner.jpg') center no-repeat;
  background-size: cover;
  @include pad {
    min-height: 20rem;
    margin-bottom: 2rem;
  }
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
    background-color: $primary;
    border-radius: 0.25rem;
    z-index: -1;
  }
}

.product-category {
  margin-bottom: 1.5rem;
  color: $muted;
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
  color: $muted;
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
  display: flex;
  margin-bottom: 1rem;
  @include mobile {
    margin-bottom: 0;
  }
}

.counter-input {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid $dark;
  border-radius: 0;
  text-align: center;
  outline: none;
  cursor: context-menu;
}

.addNum, .lessNum {
  padding: 0.4rem 0.75rem;
  border: 1px solid $dark;
  color: $dark;
  &:hover, &:focus {
    color: $white;
    background-color: darken($dark, 10%);
  }
}

.addNum {
  border-right: none;
  border-radius: 0.25rem 0 0 0.25rem;
}

.lessNum {
  border-left: none;
  border-radius: 0 0.25rem 0.25rem 0;
}

.product-subtitle {
  border-bottom: 2px solid $dark;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
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
  transition: 0.3s all ease;
  &:hover {
    box-shadow: 0px 1px 2px 4px rgba($muted, 0.3);
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
    text-align: center;
    color: $white;
}
</style>
