(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-efcc75ae"],{"0c0a":function(a,t,s){},"6cb3":function(a,t,s){"use strict";var e=s("0c0a"),i=s.n(e);i.a},d72e:function(a,t,s){"use strict";s.r(t);var e=function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("div",[s("loading",{attrs:{active:a.isLoading,"is-full-page":!0},on:{"update:active":function(t){a.isLoading=t}}}),s("nav",{staticClass:"navbar sticky-top navbar-dark bg-dark"},[s("router-link",{staticClass:"navbar-brand logo",attrs:{to:"/"}},[a._v("Adagio")]),s("div",{staticClass:"navbar-nav ml-auto d-none d-md-flex"},[s("a",{staticClass:"nav-link",attrs:{href:"#"},on:{click:function(t){return t.preventDefault(),a.logout()}}},[a._v("登出")])]),a._m(0)],1),s("div",{staticClass:"container-fluid"},[s("div",{staticClass:"row"},[s("nav",{staticClass:"col-md-3 col-lg-2 d-md-block collapse sidebar",attrs:{id:"sidebar"}},[s("h6",{staticClass:"sidebar-subtitle"},[a._v("管理員")]),s("ul",{staticClass:"nav flex-column mb-4"},[s("li",{staticClass:"nav-item"},[s("router-link",{staticClass:"nav-link",attrs:{to:"/admin/productsmanage"}},[s("i",{staticClass:"fas fa-shopping-bag"}),a._v(" 產品管理 ")])],1),s("li",{staticClass:"nav-item"},[s("router-link",{staticClass:"nav-link",attrs:{to:"/admin/ordersmanage"}},[s("i",{staticClass:"far fa-list-alt"}),a._v(" 訂單管理 ")])],1),s("li",{staticClass:"nav-item"},[s("router-link",{staticClass:"nav-link",attrs:{to:"/admin/couponsmanage"}},[s("i",{staticClass:"fas fa-money-bill"}),a._v(" 優惠劵管理 ")])],1),s("li",{staticClass:"nav-item"},[s("router-link",{staticClass:"nav-link",attrs:{to:"/admin/storagesmanage"}},[s("i",{staticClass:"fas fa-image"}),a._v(" 圖片管理 ")])],1)]),s("h6",{staticClass:"sidebar-subtitle"},[a._v("購物頁")]),s("ul",{staticClass:"nav flex-column"},[s("li",{staticClass:"nav-item"},[s("router-link",{staticClass:"nav-link",attrs:{to:"/"}},[s("i",{staticClass:"fas fa-store"}),a._v(" Adagio ")])],1)])]),s("main",{staticClass:"col-md-9 col-lg-10 p-4"},[a.checkSuccess?s("router-view"):a._e()],1)])])],1)},i=[function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("button",{staticClass:"navbar-toggler d-md-none",attrs:{type:"button","data-toggle":"collapse","data-target":"#sidebar","aria-controls":"sidebar","aria-expanded":"false","aria-label":"Toggle navigation"}},[s("span",{staticClass:"navbar-toggler-icon"})])}],o=(s("ac1f"),s("5319"),s("5530")),n=s("2f62"),c={name:"DashboardLayout",data:function(){return{token:"",checkSuccess:!1}},methods:{logout:function(){var a=this,t=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,"$1");a.$store.dispatch("updateLoading",!0,{root:!0}),a.$http({method:"post",url:"".concat("https://course-ec-api.hexschool.io/api","/auth/logout"),data:{api_token:t},headers:{authorization:"Bearer ".concat(t)}}).then((function(){document.cookie="hexToken=;expires=;path=/",a.checkSuccess=!1,a.$store.dispatch("updateLoading",!1,{root:!0});var t={icon:"success",title:"登出成功"};a.$store.dispatch("alertMessageModules/openToast",t),a.$router.push("/login")}))},checkLogin:function(){var a=this,t="".concat("https://course-ec-api.hexschool.io/api","/auth/check");a.token=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,"$1"),a.$store.dispatch("updateLoading",!0,{root:!0}),a.$http.post(t,{api_token:a.token}).then((function(t){if(!t.data.success){var s={icon:"error",title:"出現錯誤"};a.$store.dispatch("alertMessageModules/openToast",s),a.$router.push("/login")}a.checkSuccess=!0,a.$http.defaults.headers.common.Authorization="Bearer ".concat(a.token),a.$store.dispatch("updateLoading",!1,{root:!0})}))}},computed:Object(o["a"])({},Object(n["c"])(["isLoading"])),created:function(){this.checkLogin()}},r=c,l=(s("6cb3"),s("2877")),u=Object(l["a"])(r,e,i,!1,null,"307ce495",null);t["default"]=u.exports}}]);
//# sourceMappingURL=chunk-efcc75ae.266b2eda.js.map