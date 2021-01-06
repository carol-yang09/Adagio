# Adagio 美食電商網站 Vue CLI

![banner.png](https://i.postimg.cc/4NQzJLdv/banner.png)

## 簡介

以 Vue Cli、 Vuex 及 Vue Router 模擬的美食電商網站

* Demo：

[https://carol-yang09.github.io/Adagio](https://carol-yang09.github.io/Adagio)

* 特色：
    - 前台
        - 搜尋產品
        - 產品分類切換
        - 產品列表分頁展示
        - 購物車管理
        - 利用 localStorage 管理我的最愛
        - 商品、圖片輪播
        - 單一產品詳細介紹
    - 後台
        - 管理者登入、登出
        - 產品、訂單、優惠劵、圖片管理

## 使用技術

* Vue Cli
* Vue Router
* Vuex
* RWD
* SCSS
* Bootstrop
* RESTful API
* ESlint - Airbnb
* Vue 插件：vue-awesome-swiper (輪播)、vue-loading-overlay (載入效果)、vee-validate (表單驗證)、vue-sweetalert2 (彈跳視窗)、vue2-editor (編輯器)、AOS (頁面滾動動畫)

## 頁面介紹

### 首頁

* 餐廳特色、產品特色、顧客回饋輪播

![home.gif](https://i.postimg.cc/mkXyDV9G/home.gif)

### 產品列表

* 產品搜尋、分類切換、分頁切換、加入我的最愛、加入購物車

![products.png](https://i.postimg.cc/PJz85Jtf/products.png)

### 單一產品

* 單一產品介紹、相關產品列表、加入我的最愛、加入購物車

![product-2.png](https://i.postimg.cc/mD9HKVJH/product-2.png)

### 結帳頁面

* 優惠劵套用
* 確認購物清單，刪除、修改購物車
* 填寫訂購資料
    - 驗證訂購表單，成功後才可進入結帳頁面
* 完成訂單回饋

![checkout.gif](https://i.postimg.cc/TwYywbXV/checkout.gif)

### 關於我們

* 餐廳介紹、圖片輪播

![about.png](https://i.postimg.cc/x8SzQMVF/about.png)

### 聯絡我們

* 驗證留言表單、餐廳聯絡資訊

![contact.gif](https://i.postimg.cc/9fBRCpsX/contact.gif)

### 後台

* 使用 vee-validate 插件驗證登入表單
* 產品管理：產品新增、編輯、刪除
* 訂單管理：訂單新增、編輯、刪除
* 優惠劵管理：優惠劵新增、編輯、刪除
* 圖片管理：圖片編輯、刪除

![admin.gif](https://i.postimg.cc/0jhrcHKn/admin.gif)

### 我的最愛、購物車

#### 我的最愛列表
  * 利用 localStorage 新增、讀取、修改、刪除我的最愛

#### 購物車列表
  * 使用 Axios 串接購物車 API
  * 讀取、刪除購物車資料

![dropdown.png](https://i.postimg.cc/rs6Sp7xj/dropdown.png)

## 使用套件

* [vue-axios](https://github.com/imcvampire/vue-axios)
* [vee-validate (驗證表單)](https://github.com/logaretm/vee-validate)
* [vue-loading-overlay (Loading 效果)](https://github.com/ankurk91/vue-loading-overlay)
* [vue-awesome-swiper (輪播)](https://github.com/surmon-china/vue-awesome-swiper)
* [vue2-editor (編輯器)](https://github.com/davidroyer/vue2-editor)
* [vue-sweetalert2 (彈框效果)](https://github.com/avil13/vue-sweetalert2)
* [AOS](https://github.com/michalsnik/aos)
* [jQuery](https://jquery.com/)
* [Google Font](https://fonts.google.com/)
* [Font Awesome ](https://fontawesome.com/)

## 圖片來源：

[Unsplash](https://unsplash.com/)

## API

[六角學院](https://challenge.thef2e.com/user/1989?schedule=3949#works-3949)
