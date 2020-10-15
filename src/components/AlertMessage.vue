<template>
  <div></div>
</template>
<script>
export default {
  name: 'Alert',
  data() {
    return {};
  },
  computed: {
  },
  methods: {
    openToast(msg) {
      const vm = this;
      vm.$swal({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        icon: msg.icon,
        title: msg.title,
      });
    },
    openModal(msg) {
      const vm = this;
      vm.$swal({
        title: msg.title,
        text: msg.text,
        confirmButtonColor: '#343a40',
        confirmButtonText: '確認',
        customClass: {
          title: `swal-title swal-title-${msg.status}`,
        },
      });
    },
  },
  created() {
    const vm = this;
    vm.$bus.$on('alertmessage', (msg, type = 'toast') => {
      if (type === 'toast') {
        vm.openToast(msg);
      } else {
        vm.openModal(msg);
      }
    }); // 外層使用
    // vm.$bus.$emit('alertmessage'); 內層使用
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/all';

// 更改 vue-sweetalert2 預設樣式

.swal2-toast {
  min-width: 15rem;
}

.swal2-modal {
  padding: 2rem;
}

// 自訂 vue-sweetalert2 樣式

.swal-title {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  font-size: 1.5rem;
  border-bottom: 4px solid $dark;
}

.swal-title-secondary {
  border-bottom: 4px solid $secondary;
}

.swal-title-success {
  border-bottom: 4px solid $success;
}

.swal-title-info {
  border-bottom: 4px solid $info;
}

.swal-title-danger {
  border-bottom: 4px solid $danger;
}

.swal-success {
  background-color: $success;
}
</style>
