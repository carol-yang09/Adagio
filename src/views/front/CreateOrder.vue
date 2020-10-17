<template>
  <div>
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

      <!-- step 1 -->
      <div v-if="step === 1">

        <table class="table table-borderless checkorder-table">
          <thead>
            <tr class="bg-dark text-light">
              <th scope="col" class="d-none d-md-table-cell text-center">縮圖</th>
              <th scope="col" class="text-center">商品名稱</th>
              <th scope="col" class="d-none d-sm-table-cell text-center">數量</th>
              <th scope="col" class="d-none d-md-table-cell text-center">原價</th>
              <th scope="col" class="d-none d-sm-table-cell text-center">售價</th>
              <th scope="col" class="text-center">刪除</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-bottom" v-for="cart in carts" :key="cart.product.id">
              <td class="d-none d-md-table-cell text-center">
                <span class="thumbnail"
                :style="{backgroundImage: 'url(' + cart.product.imageUrl[0] + ')'}">
                </span>
              </td>
              <td class="align-middle">
                {{ cart.product.title }}
              </td>
              <td class="d-none d-sm-table-cell align-middle text-center">
                <div class="counter">
                  <a href="#" class="lessNum"
                   @click.prevent="
                   updateCartItem(cart.product.id, cart.quantity - 1, $event)"
                  >
                    <i class="fas fa-minus"></i>
                  </a>
                  <input type="number" min="1" readonly="readonly"
                   :value="cart.quantity" class="counter-input">
                  <a href="#" class="addNum"
                   @click.prevent="
                   updateCartItem(cart.product.id, cart.quantity + 1, $event)"
                  >
                    <i class="fas fa-plus"></i>
                  </a>
                </div>
              </td>
              <td class="d-none d-md-table-cell align-middle text-right">
                {{ cart.product.origin_price | currency }}
              </td>
              <td class="d-none d-sm-table-cell align-middle text-right">
                {{ cart.product.price | currency }}
              </td>
              <td class="align-middle text-center">
                <a href="#" class="text-danger" @click.prevent="delCartItem(cart.product.id)">
                  <i class="far fa-trash-alt"></i>
                </a>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-light table-borderless border-top" v-show="cartsNum">
            <tr>
              <td class="d-none d-md-table-cell" colspan="2"></td>
              <td class="d-none d-sm-table-cell"></td>
              <td class="d-none d-sm-table-cell text-right">共 {{ cartsNum }} 件</td>
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

        <div v-show="!cartsNum" class="text-center">
          <h4 class="h5 mb-4 text-muted">購物車是空的</h4>
          <router-link to="/products" class="btn btn-secondary btn-lg py-2">
            <span class="mr-1">
              <i class="far fa-hand-point-up fa-lg"></i>
            </span>
            立即購物去
          </router-link>
        </div>

        <div class="input-group mb-4 mb-xl-5" v-show="cartsNum">
          <input type="text" class="form-control" placeholder="請輸入折價券代碼" v-model.trim="couponInput">
          <div class="input-group-append">
            <button type="button" class="btn btn-dark" @click.prevent="getCoupon()">
              使用 Coupon 券
            </button>
          </div>
        </div>

        <div class="checkorder-btngroup" v-show="cartsNum">
          <router-link to="/products" class="btn btn-muted btn-lg mb-3 mb-md-0">
            <span class="mr-1">
              <i class="fas fa-arrow-alt-circle-left"></i>
            </span>
              繼續購物
          </router-link>
          <button type="submut" class="btn btn-dark btn-lg" :disabled="!cartsNum"
           @click.prevent="step = 2">
            確認結帳
            <span class="ml-1">
            <i class="fas fa-arrow-alt-circle-right"></i>
            </span>
          </button>
        </div>

      </div>

       <!-- step 2 -->
      <div v-if="step === 2">

        <table class="table table-borderless checkorder-table mb-5">
          <thead>
            <tr class="bg-dark text-light">
              <th colspan="4" class="pl-4">購物清單</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-bottom" v-for="cart in carts" :key="cart.product.id">
              <td class="d-none d-md-table-cell text-center">
                <span class="thumbnail-small"
                :style="{backgroundImage: 'url(' + cart.product.imageUrl[0] + ')'}">
                </span>
              </td>
              <td class="align-middle">
                {{ cart.product.title }}
              </td>
              <td class="align-middle text-center">
                {{ cart.quantity }} {{ cart.product.unit }}
              </td>
              <td class="d-none d-md-table-cell align-middle text-right">
                {{ cart.product.price * cart.quantity | currency }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-light table-borderless border-top" v-show="cartsNum">
            <tr v-show="coupon.title" class="text-success">
              <td class="d-none d-md-table-cell text-right" colspan="2">
                已套用折價卷 - [{{ coupon.title }}]
              </td>
              <td class="text-right">折扣</td>
              <td class="text-right">
                - {{ totalMoney - (totalMoney * coupon.percent/100 ) | currency }}
              </td>
            </tr>
            <tr :class="{'text-success': coupon.title}">
              <td class="d-none d-md-table-cell" colspan="2"></td>
              <td class="text-right">總計</td>
              <td class="text-right" v-show="!coupon.title">{{ totalMoney | currency }}</td>
              <td class="text-right" v-show="coupon.title">
                {{ totalMoney * coupon.percent/100 | currency }}
              </td>
            </tr>
          </tfoot>
        </table>

        <h2 class="checkorder-title">訂購資料</h2>

        <ValidationObserver v-slot="{ invalid }" tag="form"
         @submit.prevent="createOrder()">

          <div class="bg-light  mb-3 mb-md-5 p-4">
            <div class="form-row">
              <ValidationProvider class="form-group col-md-6" name="收件人姓名"
               rules="required" tag="div" v-slot="{ errors, classes }">
                  <label for="name">
                    <span class="text-danger">*</span>
                    收件人姓名：
                  </label>
                  <input type="text" id="name" class="form-control" placeholder="請輸入收件人姓名"
                  :class="classes" v-model="orderData.name" required>
                  <span class="invalid-feedback">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider class="form-group col-md-6" name="收件人電話"
               rules="required" tag="div" v-slot="{ errors, classes }">
                  <label for="tel">
                    <span class="text-danger">*</span>
                    收件人電話：
                  </label>
                  <input type="text" id="tel" class="form-control" placeholder="請輸入收件人電話"
                  :class="classes" v-model="orderData.tel" required>
                  <span class="invalid-feedback">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>

            <ValidationProvider class="form-group" name="電子郵件" rules="required|email" tag="div"
             v-slot="{ errors, classes }">
              <label for="email">
                <span class="text-danger">*</span>
                電子郵件：
              </label>
              <input type="email" id="email" class="form-control" placeholder="請輸入電子郵件"
              :class="classes" v-model="orderData.email" required>
              <span class="invalid-feedback">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider class="form-group" name="收件地址" rules="required" tag="div"
             v-slot="{ errors, classes }">
              <label for="address">
                <span class="text-danger">*</span>
                收件地址：
              </label>
              <input type="text" id="address" class="form-control" placeholder="請輸入收件地址"
              :class="classes" v-model="orderData.address" required>
              <span class="invalid-feedback">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider class="form-group" name="支付方式" rules="required" tag="div"
             v-slot="{ errors, classes }">
              <label for="payment">
                <span class="text-danger">*</span>
                支付方式
              </label>
              <select id="payment" class="form-control" name="支付方式" :class="classes"
              v-model="orderData.payment" required>
                <option selected="selected" disabled value="">請選擇支付方式</option>
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

            <div class="form-group">
              <label for="message">備註：</label>
              <textarea class="form-control" id="message" rows="3" placeholder="留言給我們"
              v-model="orderData.message"
              ></textarea>
            </div>
          </div>

          <div class="checkorder-btngroup">
            <button type="submut" class="btn btn-muted btn-lg mb-3 mb-md-0"
             @click.prevent="step = 1">
              <span class="mr-1">
                <i class="fas fa-arrow-alt-circle-left"></i>
              </span>
              回上一步
            </button>
            <button type="submut" class="btn btn-dark btn-lg" :disabled="cartsNum && invalid">
              確認結帳
              <span class="ml-1">
              <i class="fas fa-arrow-alt-circle-right"></i>
              </span>
            </button>
          </div>
        </ValidationObserver>

      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CreateOrder',
  data() {
    return {
      step: 1,
      couponInput: '',
      coupon: {},
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
    updateCartItem(id, num) {
      if (num <= 0) {
        const msg = {
          icon: 'error',
          title: '商品數量必須大於 1 樣',
        };
        this.$store.dispatch('alertMessageModules/openToast', msg);
      } else {
        this.$store.dispatch('cartModules/updateCartItem', { id, num, method: 'set' });
      }
    },
    delCartItem(id) {
      this.$store.dispatch('cartModules/delCartItem', id);
    },
    getCoupon() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/coupon/search`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.coupon = {};
      vm.orderData.coupon = '';

      if (!vm.couponInput) {
        vm.$store.dispatch('updateLoading', false, { root: true });
        const msg = {
          title: '錯誤',
          text: '請輸入折價劵代碼',
          status: 'danger',
        };
        vm.$store.dispatch('alertMessageModules/openModal', msg);
        return;
      }

      vm.$http.post(url, { code: vm.couponInput }).then((res) => {
        vm.coupon = res.data.data;
        vm.orderData.coupon = res.data.data.code;
        const msg = {
          icon: 'success',
          title: '已成功使用此 Coupon 券',
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);

        vm.couponInput = '';
        vm.$store.dispatch('updateLoading', false, { root: true });
      }).catch(() => {
        const msg = {
          icon: 'error',
          title: '出錯了~ 此 Coupon 券無效',
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);
        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/orders`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.post(url, vm.orderData).then((res) => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        const { id } = res.data.data;
        vm.$store.dispatch('cartModules/getCarts');
        vm.$swal({
          title: '已成立訂單',
          text: '訂單已成立，請盡速結帳喔!!',
          showCancelButton: false,
          confirmButtonColor: '#28a745',
          allowOutsideClick: false,
          confirmButtonText: '確認',
          customClass: {
            title: 'swal-title swal-title-success',
          },
        }).then(() => {
          vm.$router.push({ name: 'Order', params: { orderId: id } });
        });
      }).catch(() => {
        const msg = {
          title: '錯誤',
          text: '出錯了~ 請重新訂購',
          status: 'danger',
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);
        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
    ...mapActions('cartModules', ['getCarts']),
  },
  computed: {
    ...mapGetters('cartModules', ['carts', 'cartsNum', 'totalMoney']),
  },
  created() {
    this.$store.dispatch('cartModules/getCarts');
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.pagebanner-img {
  background-image: url('../../assets/images/banner-checkorder.jpg');
}

.checkorder-table {
  margin-bottom: 2rem;
  th {
    font-weight: normal;
  }
}

.thumbnail, .thumbnail-small {
  display: inline-block;
  width: 5rem;
  height: 5rem;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.thumbnail-small {
  width: 4rem;
  height: 4rem;
}

.checkorder-btngroup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @include pad {
    flex-direction: row;
  }
}

.checkorder-form {
  padding: 0 2rem;
}

</style>
