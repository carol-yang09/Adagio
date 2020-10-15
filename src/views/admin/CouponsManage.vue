<template>
  <div>
    <div class="mb-4 text-right">
      <button type="button" class="btn btn-dark" @click.prevent="openModal('create')">
        新增優惠劵
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">優惠劵名稱</th>
            <th scope="col" class="d-none d-lg-table-cell">優惠碼</th>
            <th scope="col" class="d-none d-sm-table-cell">折扣比 %</th>
            <th scope="col" class="d-none d-md-table-cell">到期日</th>
            <th scope="col" class="d-none d-sm-table-cell">是否啟用</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody v-if="coupons.length">
          <tr v-for="item in coupons" :key="item.id">
            <td>{{ item.title }}</td>
            <td class="d-none d-lg-table-cell">
              {{ item.code }}
            </td>
            <td class="d-none d-sm-table-cell">
              {{ item.percent }}
            </td>
            <td class="d-none d-md-table-cell">
              {{ item.deadline.datetime }}
            </td>
            <td class="d-none d-sm-table-cell">
              <span class="text-success" v-if="item.enabled">啟用</span>
              <span class="text-muted" v-else>未啟用</span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-dark"
                 @click.prevent="openModal('update', item)">
                  編輯
                </button>
                <button type="button" class="btn btn-outline-danger"
                 @click.prevent="openModal('del', item)">
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- editModal -->
    <div class="modal fade" id="editModal" role="dialog" aria-labelledby="editModalTitle"
     aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-light">
            <h5 class="modal-title" id="editModalTitle">
              {{ status === 'create' ? '新增優惠劵' : '更新優惠劵' }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="title" id="title" class="form-control" placeholder="請輸入標題"
               v-model="tempCoupon.title" required>
            </div>
            <div class="form-group">
              <label for="code">優惠碼</label>
              <input type="text" id="code" class="form-control" placeholder="請輸入優惠碼"
               v-model="tempCoupon.code" required>
            </div>
            <div class="form-group">
              <label for="time">到期時間</label>
              <input type="datetime-local" id="time" class="form-control" placeholder="請輸入到期時間"
               v-model="deadline.time" :min="deadline.min" required>
            </div>
            <div class="form-group">
              <label for="percent">折扣百分比</label>
              <input type="text" id="cpercent" class="form-control" placeholder="請輸入折扣百分比"
               v-model="tempCoupon.percent" required>
            </div>
            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="enabled"
               v-model="tempCoupon.enabled" :true-value="true" :false-value="false">
              <label class="form-check-label" for="enabled">是否啟用</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-muted" data-dismiss="modal">取消</button>
            <button type="submit" class="btn btn-dark" @click.prevent="updateCoupon()">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- delModal -->
    <div class="modal fade" id="delModal" role="dialog" aria-labelledby="delModalTitle"
     aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-light">
            <h5 class="modal-title" id="delModalTitle">刪除優惠劵</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            確定要刪除該筆優惠劵 (刪除後無法復原)
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" data-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-outline-danger"
             @click.prevent="delCoupon()">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <Pagination @get-data="getCoupons"/>
  </div>
</template>

<script>
/* global $ */
import dayjs from 'dayjs';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'CouponsManage',
  data() {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        code: '',
        deadline_at: '',
        percent: 100,
        enabled: false,
      },
      deadline: {
        time: '',
        min: dayjs(new Date()).format('YYYY-MM-DDTHH:mm'),
      },
      status: '',
    };
  },
  methods: {
    getCoupons(page = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupons?page=${page}`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.get(url).then((res) => {
        vm.coupons = res.data.data;
        vm.$store.dispatch('paginationModules/getPagination', { routerName: this.$route.name, data: res.data });
        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
    openModal(status, item) {
      this.deadline.time = '';
      this.status = '';
      switch (status) {
        case 'del':
          $('#delModal').modal('show');
          this.tempCoupon = { ...item };
          break;
        case 'update':
          $('#editModal').modal('show');
          this.tempCoupon = { ...item };
          this.status = 'update';
          this.deadline.time = dayjs(item.deadline.datetime).format('YYYY-MM-DDTHH:mm');
          break;
        case 'create':
          $('#editModal').modal('show');
          this.tempCoupon = {
            enabled: false,
          };
          this.status = 'create';
          break;
        default:
          break;
      }
    },
    updateCoupon() {
      const vm = this;
      let method = 'post';
      let status = '新增';
      vm.tempCoupon.deadline_at = dayjs(vm.deadline.time).format('YYYY-MM-DD HH:mm:ss');
      let url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupon`;
      if (vm.status === 'update') {
        method = 'patch';
        status = '更新';
        url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupon/${vm.tempCoupon.id}`;
      }
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http[method](url, vm.tempCoupon).then(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        vm.getCoupons();
        const msg = {
          icon: 'success',
          title: `${status}優惠劵成功`,
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);
      }).catch(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        const msg = {
          icon: 'error',
          title: `${status}優惠劵失敗`,
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);
      });
      $('#editModal').modal('hide');
    },
    delCoupon() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupon/${vm.tempCoupon.id}`;
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.delete(url).then(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        vm.getCoupons();
        const msg = {
          icon: 'success',
          title: '刪除優惠劵成功',
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);
      }).catch(() => {
        vm.$store.dispatch('updateLoading', false, { root: true });
        const msg = {
          icon: 'error',
          title: '刪除優惠劵失敗',
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);
      });
      $('#delModal').modal('hide');
    },
  },
  components: {
    Pagination,
  },
  created() {
    this.getCoupons();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';
</style>
