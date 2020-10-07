<template>
  <div class="container checkorder">
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <ul class="step">
      <li class="step-item active" :class="{'step-active': step === 1 }">結帳</li>
      <li class="step-item"
       :class="{'active': step === 2 || step === 3, 'step-active': step === 2 && !order.paid}">
        付款
      </li>
      <li class="step-item"
       :class="{'active': step === 3 || order.paid, 'step-active': step === 3 || order.paid}">
        完成
      </li>
    </ul>

    <div v-if="step === 2">
      <h2 class="checkorder-title">訂單清單</h2>
      <div class="table-responsive-md mb-4">
        <table class="table">
          <thead>
            <tr>
              <th scope="col" class="text-center">商品名稱</th>
              <th scope="col" class="text-center">數量</th>
              <th scope="col" class="d-none d-sm-table-cell text-center">售價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in order.products" :key="key">
              <td class="align-middle text-nowrap">
                {{ item.product.title }}
              </td>
              <td class="align-middle text-center text-nowrap">
                {{ item.quantity }} / {{ item.product.unit }}
              </td>
              <td class="d-none d-sm-table-cell align-middle text-right">
                {{ item.product.price | currency }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-light table-borderless border-top">
            <tr v-if="order.coupon" class="text-success">
              <td class="d-none d-sm-table-cell"></td>
              <td class="text-right" colspan="2">已使用折價劵 - [{{ order.coupon.title }}]</td>
            </tr>
            <tr>
              <td class="d-none d-sm-table-cell"></td>
              <td class="text-right">應付</td>
              <td class="text-right">{{ order.amount | currency }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h2 class="checkorder-title">訂購資訊</h2>
      <div class="table-responsive-md mb-4">
        <table class="table" v-if="order.user">
          <tr>
            <th scope="row" width="150" class="text-nowrap">收件人</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="text-nowrap">電子信箱</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="text-nowrap">電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="text-nowrap">地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="text-nowrap">支付方式</th>
            <td>{{ order.payment }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="text-nowrap">備註</th>
            <td>{{ order.message }}</td>
          </tr>
          <tr>
            <th scope="row" width="150" class="text-nowrap">付款狀態</th>
            <td class="text-success" v-if="order.paid">已付款</td>
            <td v-else>未付款</td>
          </tr>
        </table>
      </div>

      <div class="text-center" v-if="!order.paid">
        <a href="#" class="btn btn-dark btn-lg" @click.prevent="payOrder(orderId)">
          付款去
          <span class="ml-1">
            <i class="fas fa-money-check-alt"></i>
          </span>
        </a>
      </div>
    </div>

    <div v-if="step === 3" class="text-center">
      <div class="done">
        <div class="done-img"></div>
        <h2 class="display-4 mb-5">付款成功</h2>
        <h3 class="h2">您已完成訂單</h3>
      </div>

      <div class="text-center">
        <router-link to="/products" class="btn btn-dark btn-lg">
          繼續購物
          <span class="ml-1">
            <i class="fas fa-shopping-basket"></i>
          </span>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Order',
  data() {
    return {
      isLoading: false,
      step: 2,
      orderId: '',
      order: {},
    };
  },
  methods: {
    getOrder(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/orders/${id}`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.order = res.data.data;
        vm.isLoading = false;
      }).catch(() => {
        vm.isLoading = false;
        vm.$swal({
          title: '出錯了',
          text: '糟糕，找不到此訂單，將返回首頁',
          icon: 'warning',
          confirmButtonColor: '#dc3545',
          allowOutsideClick: false,
          confirmButtonText: '確認',
        }).then((result) => {
          if (result.isConfirmed) {
            vm.$router.push('/');
          }
        });
      });
    },
    payOrder(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/orders/${id}/paying`;
      vm.isLoading = true;
      vm.$http.post(url).then(() => {
        const msg = {
          icon: 'success',
          title: '付款成功',
        };
        vm.$bus.$emit('alertmessage', msg);

        vm.step = 3;
        vm.isLoading = false;
      }).catch(() => {
        const msg = {
          icon: 'error',
          title: '付款失敗',
        };
        vm.$bus.$emit('alertmessage', msg);

        vm.isLoading = false;
      });
    },
  },
  created() {
    const vm = this;
    const id = vm.$route.params.orderId;
    if (id) {
      vm.getOrder(id);
      vm.orderId = id;
    } else {
      vm.$router.push('/');
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/all';

.done {
  display: inline-block;
  position: relative;
  margin: 1.5rem 0 3rem;
  padding: 2rem;
  text-align: center;
  text-shadow: 1px 1px 3px $dark;
  color: $white;
  @include mobile {
    padding: 5rem;
  }
  @include pad {
    padding: 5rem 10rem;
  }
}

.done-img {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-image: url('../../assets/images/done.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.25rem;
  z-index: -1;
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba($dark, 0.4);
    border-radius: 0.25rem;
  }
}
</style>
