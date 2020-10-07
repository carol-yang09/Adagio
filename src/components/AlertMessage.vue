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
        icon: msg.icon,
        confirmButtonColor: '#343a40',
        confirmButtonText: '確認',
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

<style scope>
</style>
