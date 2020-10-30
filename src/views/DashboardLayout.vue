<template>
  <div>
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <nav class="navbar sticky-top navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand logo">Adagio</router-link>
      <div class="navbar-nav ml-auto d-none d-md-flex">
        <a href="#" class="nav-link" @click.prevent="logout()">登出</a>
      </div>
      <button class="navbar-toggler d-md-none" type="button" data-toggle="collapse"
       data-target="#sidebar" aria-controls="sidebar"
       aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block collapse sidebar">
          <h6 class="sidebar-subtitle">管理員</h6>
          <ul class="nav flex-column mb-4">
            <li class="nav-item">
              <router-link to="/admin/productsmanage" class="nav-link">
                <i class="fas fa-shopping-bag"></i>
                產品管理
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/ordersmanage" class="nav-link">
                <i class="far fa-list-alt"></i>
                訂單管理
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/couponsmanage" class="nav-link">
                <i class="fas fa-money-bill"></i>
                優惠劵管理
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/storagesmanage" class="nav-link">
                <i class="fas fa-image"></i>
                圖片管理
              </router-link>
            </li>
          </ul>

          <h6 class="sidebar-subtitle">購物頁</h6>
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <i class="fas fa-store"></i>
                Adagio
              </router-link>
            </li>
          </ul>
        </nav>

        <main class="col-md-9 col-lg-10 p-4">
          <router-view v-if="checkSuccess"/>
        </main>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DashboardLayout',
  data() {
    return {
      token: '',
      checkSuccess: false,
    };
  },
  methods: {
    logout() {
      const vm = this;
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http({
        method: 'post',
        url: `${process.env.VUE_APP_APIPATH}/auth/logout`,
        data: { api_token: token },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }).then(() => {
        // 清空 cookie
        document.cookie = 'hexToken=;expires=;path=/';
        vm.checkSuccess = false;
        vm.$store.dispatch('updateLoading', false, { root: true });

        const msg = {
          icon: 'success',
          title: '登出成功',
        };
        vm.$store.dispatch('alertMessageModules/openToast', msg);

        vm.$router.push('/login');
      });
    },
    checkLogin() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/auth/check`;
      vm.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      vm.$store.dispatch('updateLoading', true, { root: true });
      vm.$http.post(url, { api_token: vm.token }).then((res) => {
        if (!res.data.success) {
          const msg = {
            icon: 'error',
            title: '出現錯誤',
          };
          vm.$store.dispatch('alertMessageModules/openToast', msg);
          vm.$router.push('/login');
        }

        vm.checkSuccess = true;
        vm.$http.defaults.headers.common.Authorization = `Bearer ${vm.token}`;
        vm.$store.dispatch('updateLoading', false, { root: true });
      });
    },
  },
  computed: {
    ...mapGetters(['isLoading']),
  },
  created() {
    this.checkLogin();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.sidebar {
  padding: 1.5rem 0;
  background-color: $light;
  @include pad {
    min-height: calc(100vh - 3.5rem);
  }
}

.nav {
  text-align: center;
  @include pad {
    text-align: left;
  }
  .nav-link {
    color: $dark;
    &.active {
      color: $success;
    }
  }
}

.sidebar-subtitle {
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  @include pad {
    justify-content: space-between;
  }
}
</style>
