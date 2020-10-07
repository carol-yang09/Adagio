<template>
  <div class="login">
    <!-- loading 效果 -->
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <h1 class="logo mb-5 text-white">Adagio</h1>

    <ValidationObserver class="form-signin" v-slot="{ invalid }" tag="form"
     @submit.prevent="login()">
      <h2 class="mb-4 text-center">登入後台</h2>

      <ValidationProvider class="form-group" name="電子信箱" rules="required|email" tag="div"
       v-slot="{ errors, classes }">
        <label for="email">電子信箱</label>
        <input type="email" id="email" class="form-control" placeholder="請輸入電子信箱"
         :class="classes" v-model="auth.email" required>
        <span class="invalid-feedback">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider class="form-group mb-4" name="密碼" rules="required" tag="div"
       v-slot="{ errors, classes }">
        <label for="password">密碼</label>
        <input type="password" id="password" class="form-control" placeholder="請輸入密碼"
         :class="classes" v-model="auth.password" required>
        <span class="invalid-feedback">{{ errors[0] }}</span>
      </ValidationProvider>

      <button class="btn btn-dark btn-lg btn-block" type="submit" :disabled="invalid">確認</button>
    </ValidationObserver>

    <router-link to="/" class="text-white">
      回到首頁
      <span class="ml-3">
        <i class="fas fa-arrow-alt-circle-right"></i>
      </span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isLoading: false,
      auth: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const vm = this;
      const apiUrl = `${process.env.VUE_APP_APIPATH}/auth/login`;
      vm.isLoading = true;
      vm.$http.post(apiUrl, vm.auth).then((res) => {
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token};expires=${new Date(expired * 1000)}; path=/`;
        vm.isLoading = false;

        const msg = {
          icon: 'success',
          title: '登入成功',
        };
        vm.$bus.$emit('alertmessage', msg);

        vm.$router.push('/admin/productsmanage');
      }).catch(() => {
        vm.isLoading = false;

        const msg = {
          icon: 'error',
          title: '登入失敗',
        };
        vm.$bus.$emit('alertmessage', msg);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/all';

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $dark;
}
.form-signin {
  margin-bottom: 1rem;
  padding: 2em 3rem;
  background-color: $light;
  box-shadow: 0px 0px 4px $light;
  border-radius: 0.25rem;
}
</style>
