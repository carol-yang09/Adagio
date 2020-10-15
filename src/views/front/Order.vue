<template>
  <div>
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="pagebanner pagebanner-img">
      <h2>結帳流程</h2>
    </div>

    <div class="container checkorder">
      <ul class="step">
        <li class="step-item active" :class="{'step-active': step === 1 }">
          <span class="d-block">STEP 1</span>
          確認購物清單
        </li>
        <li class="step-item"
        :class="{'active': step === 2 || step === 3, 'step-active': step === 2 }">
          <span class="d-block">STEP 2</span>
          填寫訂購資料
        </li>
        <li class="step-item" :class="{'active': step === 3, 'step-active': step === 3 }">
          <span class="d-block">STEP 3</span>
          付款/完成訂單
        </li>
      </ul>

      <div v-if="step === 3">
        <h2 class="checkorder-title">訂單清單</h2>
        <div class="table-responsive-md mb-5">
          <table class="table">
            <tbody>
              <tr v-for="(item, key) in order.products" :key="key">
                <td class="align-middle text-nowrap">
                  {{ item.product.title }}
                </td>
                <td class="align-middle text-center text-nowrap">
                  {{ item.quantity }} / {{ item.product.unit }}
                </td>
                <td class="d-none d-sm-table-cell align-middle text-right">
                  {{ item.product.price * item.quantity | currency }}
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
                <td class="text-right">總額</td>
                <td class="text-right">{{ order.amount | currency }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <h2 class="checkorder-title">訂購資訊</h2>
        <div class="table-responsive-md order-table">
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
              <td class="text-success" v-show="order.paid">已付款</td>
              <td v-show="!order.paid">未付款</td>
            </tr>
          </table>
        </div>

        <div class="text-center" v-if="!order.paid">
          <a href="#" class="btn btn-secondary btn-lg" @click.prevent="payOrder(orderId)">
            付款去
            <span class="ml-1">
              <i class="fas fa-money-check-alt"></i>
            </span>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ThanksImg from '@/assets/images/thanks.jpg';

export default {
  name: 'Order',
  data() {
    return {
      isLoading: false,
      step: 3,
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
          confirmButtonColor: '#dc3545',
          allowOutsideClick: false,
          confirmButtonText: '確認',
          customClass: {
            title: 'swal-title swal-title-danger',
          },
        }).then(() => {
          vm.$router.push('/');
        });
      });
    },
    payOrder(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/orders/${id}/paying`;
      vm.isLoading = true;
      vm.$http.post(url).then(() => {
        vm.isLoading = false;
        vm.getOrder(id);
        vm.$swal({
          title: '付款成功',
          text: '我們已收到您的訂單，感謝您的支持!',
          showCancelButton: false,
          confirmButtonColor: '#343a40',
          allowOutsideClick: false,
          confirmButtonText: '確認',
          imageUrl: ThanksImg,
          customClass: {
            title: 'swal-title swal-title-secondary',
          },
        }).then(() => {
          vm.$router.push('/');
        });
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
@import '@/assets/scss/all';

.pagebanner-img {
  background-image: url('../../assets/images/banner-checkorder.jpg');
}

.order-table {
  margin-bottom: 3rem;
  padding: 0 1rem;
  background: $light;
}
</style>
