(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-57ef9506"],{4811:function(t,a,e){},a55b:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"login"},[e("loading",{attrs:{active:t.isLoading,"is-full-page":!0},on:{"update:active":function(a){t.isLoading=a}}}),e("h1",{staticClass:"logo"},[t._v("Adagio")]),e("ValidationObserver",{staticClass:"form-signin",attrs:{tag:"form"},on:{submit:function(a){return a.preventDefault(),t.login()}},scopedSlots:t._u([{key:"default",fn:function(a){var s=a.invalid;return[e("h2",{staticClass:"mb-4 text-center"},[t._v("登入後台")]),e("ValidationProvider",{staticClass:"form-group",attrs:{name:"電子信箱",rules:"required|email",tag:"div"},scopedSlots:t._u([{key:"default",fn:function(a){var s=a.errors,o=a.classes;return[e("label",{attrs:{for:"email"}},[t._v("電子信箱")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.auth.email,expression:"auth.email"}],staticClass:"form-control",class:o,attrs:{type:"email",id:"email",placeholder:"請輸入電子信箱",required:""},domProps:{value:t.auth.email},on:{input:function(a){a.target.composing||t.$set(t.auth,"email",a.target.value)}}}),e("span",{staticClass:"invalid-feedback"},[t._v(t._s(s[0]))])]}}],null,!0)}),e("ValidationProvider",{staticClass:"form-group mb-4",attrs:{name:"密碼",rules:"required",tag:"div"},scopedSlots:t._u([{key:"default",fn:function(a){var s=a.errors,o=a.classes;return[e("label",{attrs:{for:"password"}},[t._v("密碼")]),e("input",{directives:[{name:"model",rawName:"v-model",value:t.auth.password,expression:"auth.password"}],staticClass:"form-control",class:o,attrs:{type:"password",id:"password",placeholder:"請輸入密碼",required:""},domProps:{value:t.auth.password},on:{input:function(a){a.target.composing||t.$set(t.auth,"password",a.target.value)}}}),e("span",{staticClass:"invalid-feedback"},[t._v(t._s(s[0]))])]}}],null,!0)}),e("button",{staticClass:"btn btn-dark btn-lg btn-block",attrs:{type:"submit",disabled:s}},[t._v("確認")])]}}])}),e("router-link",{staticClass:"text-white",attrs:{to:"/"}},[t._v(" 回到首頁 "),e("span",{staticClass:"ml-3"},[e("i",{staticClass:"fas fa-arrow-alt-circle-right"})])])],1)},o=[],i=(e("99af"),e("5530")),r=e("2f62"),n={name:"Login",data:function(){return{auth:{email:"",password:""}}},methods:{login:function(){var t=this,a="".concat("https://course-ec-api.hexschool.io/api","/auth/login");t.$store.dispatch("updateLoading",!0,{root:!0}),t.$http.post(a,t.auth).then((function(a){var e=a.data,s=e.token,o=e.expired;document.cookie="hexToken=".concat(s,";expires=").concat(new Date(1e3*o),"; path=/"),t.$store.dispatch("updateLoading",!1,{root:!0});var i={icon:"success",title:"登入成功"};t.$store.dispatch("alertMessageModules/openToast",i),t.$router.push("/admin/productsmanage")})).catch((function(){t.$store.dispatch("updateLoading",!1,{root:!0});var a={icon:"error",title:"登入失敗"};t.$store.dispatch("alertMessageModules/openToast",a)}))}},computed:Object(i["a"])({},Object(r["c"])(["isLoading"]))},l=n,c=(e("bb4c"),e("2877")),u=Object(c["a"])(l,s,o,!1,null,"88024bce",null);a["default"]=u.exports},bb4c:function(t,a,e){"use strict";var s=e("4811"),o=e.n(s);o.a}}]);
//# sourceMappingURL=chunk-57ef9506.5b4a290d.js.map