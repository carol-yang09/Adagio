import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';

Vue.use(VueSweetalert2);

export default ({
  namespaced: true,
  state: {
  },
  actions: {
    openToast(context, msg) {
      Vue.swal({
        toast: true,
        showConfirmButton: false,
        timer: 2500,
        icon: msg.icon,
        title: msg.title,
      });
    },
    openModal(context, msg) {
      Vue.swal({
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
});
