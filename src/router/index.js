import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/front/Home.vue'),
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/front/Products.vue'),
      },
      {
        path: 'products/:productId',
        name: 'Product',
        component: () => import('../views/front/Product.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/front/About.vue'),
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('../views/front/Contact.vue'),
      },
      {
        path: 'createorder',
        name: 'CreateOrder',
        component: () => import('../views/front/CreateOrder.vue'),
      },
      {
        path: 'order/:orderId',
        name: 'Order',
        component: () => import('../views/front/Order.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/admin',
    component: () => import('../views/DashboardLayout.vue'),
    children: [
      {
        path: 'productsmanage',
        name: 'ProductsManage',
        component: () => import('../views/admin/ProductsManage.vue'),
      },
      {
        path: 'couponsmanage',
        name: 'CouponsManage',
        component: () => import('../views/admin/CouponsManage.vue'),
      },
      {
        path: 'ordersmanage',
        name: 'OrdersManage',
        component: () => import('../views/admin/OrdersManage.vue'),
      },
      {
        path: 'storagesmanage',
        name: 'StoragesManage',
        component: () => import('../views/admin/StoragesManage.vue'),
      },
    ],
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes,
});

export default router;
