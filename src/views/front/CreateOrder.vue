<template>
  <div class="container checkorder">
    <!-- loading 效果 -->
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <ul class="step">
      <li class="step-item active" :class="{'step-active': step === 1 }">結帳</li>
      <li class="step-item"
       :class="{'active': step === 2 || step === 3, 'step-active': step === 2 }">
        付款
      </li>
      <li class="step-item" :class="{'active': step === 3, 'step-active': step === 3 }">完成</li>
    </ul>

    <!-- step 1 -->
    <div v-if="step === 1">
      <h2 class="checkorder-title">購物車</h2>
      <table class="table mb-4">
        <thead>
          <tr>
            <th scope="col" class="d-none d-md-table-cell text-center">縮圖</th>
            <th scope="col" class="text-center">商品名稱</th>
            <th scope="col" class="d-none d-sm-table-cell text-center">數量</th>
            <th scope="col" class="d-none d-md-table-cell text-center">原價</th>
            <th scope="col" class="d-none d-sm-table-cell text-center">售價</th>
            <th scope="col" class="text-center">刪除</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cart in carts" :key="cart.product.id">
            <td class="d-none d-md-table-cell text-center">
              <span class="thumbnail"
               :style="{backgroundImage: 'url(' + cart.product.imageUrl[0] + ')'}">
              </span>
            </td>
            <td class="align-middle">
              {{ cart.product.title }}
            </td>
            <td class="d-none d-sm-table-cell align-middle text-center">
              {{ cart.quantity }} {{ cart.product.unit }}
            </td>
            <td class="d-none d-md-table-cell align-middle text-right">
              {{ cart.product.origin_price | currency }}
            </td>
            <td class="d-none d-sm-table-cell align-middle text-right">
              {{ cart.product.price | currency }}
            </td>
            <td class="align-middle text-center">
              <a href="#" class="text-danger" @click.prevent="openDelModal(cart.product.id)">
                <i class="far fa-trash-alt"></i>
              </a>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-light table-borderless border-top" v-show="cartNum">
          <tr>
            <td class="d-none d-md-table-cell" colspan="2"></td>
            <td class="d-none d-sm-table-cell"></td>
            <td class="d-none d-sm-table-cell text-right">共 {{ cartNum }} 件</td>
            <td class="text-right">總計</td>
            <td class="text-right">{{ totalMoney | currency }}</td>
          </tr>
          <tr>
            <td class="d-none d-md-table-cell" colspan="2"></td>
            <td class="d-none d-sm-table-cell" colspan="2"></td>
            <td class="text-right">運費</td>
            <td class="text-right">$0</td>
          </tr>
          <tr v-show="coupon.title" class="text-success">
            <td class="d-none d-md-table-cell" colspan="2"></td>
            <td class="d-none d-sm-table-cell text-right" colspan="2">
              已套用折價卷 - [{{ coupon.title }}]
            </td>
            <td class="text-right">折扣</td>
            <td class="text-right">
              - {{ totalMoney - (totalMoney * coupon.percent/100 ) | currency }}
            </td>
          </tr>
          <tr :class="{'text-success': coupon.title}">
            <td class="d-none d-md-table-cell" colspan="2"></td>
            <td class="d-none d-sm-table-cell" colspan="2"></td>
            <td class="text-right">應付</td>
            <td class="text-right" v-show="!coupon.title">{{ totalMoney | currency }}</td>
            <td class="text-right" v-show="coupon.title">
              {{ totalMoney * coupon.percent/100 | currency }}
            </td>
          </tr>
        </tfoot>
      </table>

      <div v-show="!cartNum" class="mb-4 text-center h4">購物車是空的</div>

      <div class="input-group mb-4 mb-md-5" v-show="cartNum">
        <input type="text" class="form-control" placeholder="請輸入折價券代碼" v-model="couponInput">
        <div class="input-group-append">
          <button type="button" class="btn btn-dark" @click.prevent="getCoupon()">
            使用 Coupon 券
          </button>
        </div>
      </div>

      <h2 class="checkorder-title">購買資訊</h2>

      <ValidationObserver v-slot="{ invalid }" tag="form"
       @submit.prevent="createOrder()">

        <div class="form-row">
          <ValidationProvider class="form-group col-md-6" name="收件人姓名" rules="required" tag="div"
            v-slot="{ errors, classes }">
              <label for="name">收件人姓名：</label>
              <input type="text" id="name" class="form-control" placeholder="請輸入收件人姓名"
               :class="classes" v-model="orderData.name" required>
              <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider class="form-group col-md-6" name="收件人電話" rules="required" tag="div"
            v-slot="{ errors, classes }">
              <label for="tel">收件人電話：</label>
              <input type="text" id="tel" class="form-control" placeholder="請輸入收件人電話"
               :class="classes" v-model="orderData.tel" required>
              <span class="invalid-feedback">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <ValidationProvider class="form-group" name="電子郵件" rules="required|email" tag="div"
        v-slot="{ errors, classes }">
          <label for="email">電子郵件：</label>
          <input type="email" id="email" class="form-control" placeholder="請輸入電子郵件"
          :class="classes" v-model="orderData.email" required>
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider class="form-group" name="收件地址" rules="required" tag="div"
         v-slot="{ errors, classes }">
          <label for="address">收件地址：</label>
          <input type="text" id="address" class="form-control" placeholder="請輸入收件地址"
          :class="classes" v-model="orderData.address" required>
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider class="form-group" name="支付方式" rules="required" tag="div"
         v-slot="{ errors, classes }">
          <label for="payment">支付方式</label>
          <select id="payment" class="form-control" name="支付方式" :class="classes"
           v-model="orderData.payment" required>
            <option selected disabled>請選擇支付方式</option>
            <option value="WebATM">WebATM</option>
            <option value="ATM">ATM</option>
            <option value="CVS">CVS</option>
            <option value="Barcode">Barcode</option>
            <option value="Credit">Credit</option>
            <option value="ApplePay">ApplePay</option>
            <option value="GooglePay">GooglePay</option>
          </select>
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>

        <div class="form-group mb-4 mb-md-5">
          <label for="message">備註：</label>
          <textarea class="form-control" id="message" rows="3" placeholder="留言給我們"
           v-model="orderData.message"
          ></textarea>
        </div>

        <div class="checkorder-btngroup">
          <router-link to="/products" class="btn btn-primary btn-lg mb-3 mb-md-0">
          <span class="mr-1">
            <i class="fas fa-arrow-alt-circle-left"></i>
          </span>
            繼續購物
          </router-link>
          <button type="submut" class="btn btn-dark btn-lg" :disabled="cartNum && invalid">
            確認結帳
            <span class="ml-1">
            <i class="fas fa-arrow-alt-circle-right"></i>
            </span>
          </button>
        </div>
      </ValidationObserver>

    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateOrder',
  data() {
    return {
      isLoading: false,
      step: 1,
      carts: {},
      couponInput: '',
      coupon: {},
      cartNum: 0,
      totalMoney: 0,
      isCreateOrderAllow: true,
      orderData: {
        name: '',
        email: '',
        tel: '',
        address: '',
        payment: '',
        coupon: '',
        message: '',
      },
    };
  },
  methods: {
    getCarts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`;
      vm.isLoading = true;
      let num = 0;
      let total = 0;
      vm.$http.get(url).then((res) => {
        vm.carts = res.data.data;
        vm.carts.forEach((item) => {
          num += Number(item.quantity);
          const price = item.product.price * item.quantity;
          total += price;
        });
        vm.cartNum = num;
        vm.totalMoney = total;
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

        vm.$emit('get-carts');
        vm.getCarts();
      }).catch(() => {
        const msg = {
          icon: 'error',
          title: '刪除購物車失敗',
        };
        vm.$bus.$emit('alertmessage', msg);

        vm.isLoading = false;
      });
    },
    getCoupon() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/coupon/search`;
      vm.isLoading = true;
      vm.coupon = {};
      vm.orderData.coupon = '';

      if (!vm.couponInput) {
        vm.isLoading = false;
        const msg = {
          title: '錯誤',
          text: '請輸入折價劵代碼',
          icon: 'info',
        };
        vm.$bus.$emit('alertmessage', msg, 'modal');
        return;
      }

      vm.$http.post(url, { code: vm.couponInput }).then((res) => {
        vm.coupon = res.data.data;
        vm.orderData.coupon = res.data.data.code;
        const msg = {
          icon: 'success',
          title: '已成功使用此 Coupon 券',
        };
        vm.$bus.$emit('alertmessage', msg);

        vm.couponInput = '';
        vm.isLoading = false;
      }).catch(() => {
        const msg = {
          icon: 'error',
          title: '出錯了~ 此 Coupon 券無效',
        };
        vm.$bus.$emit('alertmessage', msg);
        vm.isLoading = false;
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/orders`;
      vm.isLoading = true;
      vm.$http.post(url, vm.orderData).then((res) => {
        vm.isLoading = false;
        const { id } = res.data.data;
        vm.$emit('get-carts');

        vm.$swal({
          title: '已成立訂單',
          text: '訂單已成立，請盡速結帳喔!!',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#343a40',
          allowOutsideClick: false,
          confirmButtonText: '確認',
        }).then(() => {
          vm.$router.push({ name: 'Order', params: { orderId: id } });
        });
      }).catch(() => {
        const msg = {
          title: '錯誤',
          text: '出錯了~ 請重新訂購',
          icon: 'error',
        };
        vm.$bus.$emit('alertmessage', msg, 'modal');

        vm.isLoading = false;
      });
    },
  },
  created() {
    this.getCarts();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/all';

.thumbnail {
  display: inline-block;
  width: 5rem;
  height: 5rem;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.checkorder-btngroup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @include pad {
    flex-direction: row;
  }
}

</style>
