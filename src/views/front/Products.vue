<template>
  <div class="products">
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="pagebanner"></div>

    <div class="container">
      <ul class="categories">
        <li class="categories-item" v-for="category in categories" :key="category.icon"
         :class="{'active': category.title === filterCategory}">
          <a href="#" @click.prevent="filterCategory = category.title">
            <span class="mr-1">
              <i :class="category.icon"></i>
            </span>
            {{ category.title }}
          </a>
        </li>
      </ul>

      <div class="row">
        <div class="col-12 col-md-6 col-lg-4" v-for="product in filterData" :key="product.id">
          <div class="card border-0">
            <div class="card-img" :style="{backgroundImage: 'url(' + product.imageUrl[0] + ')'}">
              <div class="card-category">{{ product.category }}</div>
            </div>
            <div class="card-body text-center">
              <h4 class="card-title">{{ product.title }}</h4>
              <ul class="card-price" v-if="product.origin_price === product.price">
                <li class="price" >
                  售價： {{ product.origin_price | currency }}</li>
              </ul>
              <ul class="card-price" v-else>
                <li class="price price-through">
                  售價： {{ product.origin_price | currency }}</li>
                <li class="price">特價： {{ product.price | currency }}</li>
              </ul>
              <div class="card-btngroup">
                <a href="#" class="btn btn-outline-dark btn-sm"
                 @click.prevent="updateCartItem(product.id, 1)">
                  <span class="mr-1">
                    <i class="fas fa-shopping-basket"></i>
                  </span>
                  放入購物車
                </a>
                <router-link :to="`/products/${product.id}`" class="btn btn-outline-dark btn-sm">
                  <span class="mr-1">
                    <i class="fas fa-plus"></i>
                  </span>
                  看更多
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Products',
  data() {
    return {
      isLoading: false,
      pagination: {},
      products: {},
      carts: [],
      filterCategory: '全部',
      categories: [
        {
          title: '全部',
          icon: 'fas fa-dumpster',
        },
        {
          title: '主餐',
          icon: 'fas fa-utensils',
        },
        {
          title: '輕食',
          icon: 'fas fa-drumstick-bite',
        },
        {
          title: '甜點',
          icon: 'fas fa-cookie',
        },
        {
          title: '飲品',
          icon: 'fas fa-cocktail',
        },
      ],
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.products = res.data.data;
        vm.pagination = res.data.meta.pagination;
        vm.getQuery();
        vm.isLoading = false;
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
    updateCartItem(id, num) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      let n = 0;
      let method = 'post';

      n = Number(num);

      const isInCart = vm.carts.filter((item) => item.product.id === id);

      if (isInCart.length > 0) {
        method = 'patch';
        n = Number(isInCart[0].quantity) + Number(num);
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
    getQuery() {
      const vm = this;
      const { categoryName } = vm.$route.query;
      if (categoryName) {
        vm.filterCategory = categoryName;
      }
    },
  },
  computed: {
    filterData() {
      const vm = this;
      if (vm.filterCategory !== '全部') {
        return vm.products.filter((item) => item.category === vm.filterCategory);
      }
      return vm.products;
    },
  },
  created() {
    this.getProducts();
    this.getCarts();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.products {
  min-height: calc(100vh - 3.5rem - 3rem - 15rem);
  @include pad {
    min-height: calc(100vh - 3.5rem - 3rem - 20rem);
  }
}

.pagebanner {
  min-height: 15rem;
  margin-bottom: 3rem;
  background: url('../../assets/images/pagebanner.jpg') center no-repeat;
  background-size: cover;
  @include pad {
    min-height: 20rem;
  }
}

.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 2rem;
  @include pad {
    margin-bottom: 0;
  }
}

.categories-item {
  margin-left: 1rem;
  margin-bottom: 2rem;
  position: relative;
  background-color: $dark;
  border: 2px solid $dark;
  border-radius: 0.25rem;
  transition: 0.3s all ease;
  @include pad {
    margin-bottom: 4rem;
  }
  a {
    display: block;
    padding: 0.5rem 1.5rem;
  }
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 100%;
    height: 100%;
    background-color: $primary;
    transition: 0.3s all ease;
    border-radius: 0.25rem;
    z-index: -1;
  }
  &:hover{
    background-color: $white;
    a {
      text-decoration: none;
      color: $dark;
    }
  }
  &.active {
    background-color: $primary;
    &:hover {
      background-color: $white;
    }
    a {
      color: $dark;
    }
    &:before {
      background-color: $dark;
    }
  }
}

.card {
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: 0 0 4px 2px $primary;
  @include desktop {
    margin-bottom: 3rem;
  }
}

.card-img {
  position: relative;
  height: 10rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-category {
  position: absolute;
  bottom: -0.5rem;
  left: 45%;
  padding: 0.25rem 0.5rem;
  background-color: $dark;
  border-bottom-right-radius: 0.25rem;
  color: $white;
  font-size: 0.75rem;
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
  color: $muted;
  font-size: 1rem;
  text-decoration: line-through;
}

.card-btngroup {
  display: flex;
  justify-content: space-between;
}
</style>
