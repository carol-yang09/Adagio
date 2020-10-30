<template>
  <div>
    <div class="pagebanner pagebanner-img">
      <h2>聯絡我們</h2>
    </div>

    <div class="contact">
      <div class="contact-info" data-aos="zoom-in" data-aos-duration="1000">
        <h2 class="contact-title">
          留言給我們
        </h2>
        <p class="contact-text">
          Adagio 感謝您拜訪，如果您有任何疑問或建議，歡迎填寫表單，我們將盡快為您服務。
        </p>
        <p class="contact-warning">
          星號 * 為必填欄位
        </p>
      </div>
      <ValidationObserver class="contact-form" v-slot="{ invalid }" tag="form"
        @submit.prevent="sendMessage()">

        <ValidationProvider class="form-group row" name="姓名" rules="required" tag="div"
          v-slot="{ errors, classes }">
          <label for="name" class="col-sm-2 col-form-label">
            <span class="text-danger">*</span>
            姓名
          </label>
          <div class="col-sm-10">
            <input type="text" id="name" class="form-control" placeholder="請輸入姓名"
              :class="classes" v-model="tempData.name" required>
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider class="form-group row" name="電話" rules="required" tag="div"
          v-slot="{ errors, classes }">
          <label for="tel" class="col-sm-2 col-form-label">
            <span class="text-danger">*</span>
            電話
          </label>
          <div class="col-sm-10">
            <input type="text" id="tel" class="form-control" placeholder="請輸入電話"
              :class="classes" v-model="tempData.tel" required>
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider class="form-group row" name="電子郵件" rules="required|email" tag="div"
          v-slot="{ errors, classes }">
          <label for="email" class="col-sm-2 col-form-label">
            <span class="text-danger">*</span>
            電子郵件
          </label>
          <div class="col-sm-10">
            <input type="email" id="email" class="form-control" placeholder="請輸入電子郵件"
              :class="classes" v-model="tempData.email" required>
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider class="form-group row" name="留言" rules="required" tag="div"
          v-slot="{ errors, classes }">
          <label for="message" class="col-sm-2 col-form-label">
            <span class="text-danger">*</span>
            留言
          </label>
          <div class="col-sm-10">
            <textarea class="form-control" id="message" rows="3" placeholder="留言給我們"
              :class="classes" v-model="tempData.message" required></textarea>
            <span class="invalid-feedback">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <div class="text-center">
          <button type="submit" class="btn btn-dark btn-lg" :disabled="invalid">送出</button>
        </div>
      </ValidationObserver>
    </div>

    <div class="contact contact-connection">
      <div class="contact-info" data-aos="zoom-in" data-aos-duration="1000">
        <h2 class="contact-title">
          聯絡資訊
        </h2>
        <ul class="contact-list">
          <li>
            <h3>
              <span class="text-danger">
                <i class="fas fa-phone-alt"></i>
              </span>
              電話：
            </h3>
            <p>12345678910</p>
          </li>
          <li>
            <h3>
              <span class="text-danger">
                <i class="fas fa-envelope"></i>
              </span>
              聯絡信箱：
            </h3>
            <p>adagio@mail.com</p>
          </li>
          <li>
            <h3>
              <span class="text-danger">
                <i class="fas fa-map-marker-alt"></i>
              </span>
              地址：
            </h3>
            <p>台北市信義區信義路五段7號1樓</p>
          </li>
          <li>
            <h3>
              <span class="text-danger">
                <i class="fas fa-clock"></i>
              </span>
              營業時間：
            </h3>
            <p>
              周一至周日全天營業 11:00-21:00
              <br>
              最後點餐時間：20:30
            </p>
          </li>
        </ul>
      </div>

      <div class="contact-map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8115.5320544971555!2d121.56105938581133!3d25.032086088602032!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abb6da80a7ad%3A0xacc4d11dc963103c!2z5Y-w5YyXMTAx!5e0!3m2!1szh-TW!2stw!4v1600271959150!5m2!1szh-TW!2stw"
          frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0">
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      tempData: {
        name: '',
        email: '',
        tel: '',
        message: '',
      },
    };
  },
  methods: {
    sendMessage() {
      const vm = this;
      const msg = {
        title: '感謝您',
        text: '謝謝您的回饋，我們已收到',
        status: 'success',
      };
      vm.$store.dispatch('alertMessageModules/openModal', msg);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.pagebanner-img {
  background-image: url('../../assets/images/banner-contact.jpg');
}

.contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include desktop-s {
    flex-direction: row;
  }
}

@include desktop-s {
  .contact-connection {
    flex-direction: row-reverse;
  }
}

.contact-info {
  width: 100%;
  padding: 3rem 0;
  text-align: center;
  @include desktop-s {
    width: 50%;
  }
}

.contact-title {
  display: inline-block;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid $dark;
  font-size: 1.75rem;
}

.contact-text {
  max-width: 19rem;
  margin: 0 auto;
  line-height: 1.75;
  letter-spacing: 0.25rem;
}

.contact-warning {
  display: inline-block;
  margin-bottom: 0;
  padding-top: 1rem;
  color: $danger;
}

.contact-form {
  flex: 1;
  width: 100%;
  padding: 2rem 1.5rem 1rem;
  background-color: $light;
  @include desktop-s {
    padding: 5rem 3rem 4rem;
  }
}

.contact-list {
  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include desktop-s {
      flex-direction: row;
    }
  }
  h3 {
    margin-bottom: 0.25rem;
    letter-spacing: 0.25rem;
    font-size: 1rem;
  }
}

.contact-map {
  flex: 1;
  width: 100%;
  padding: 1.5rem;
  background-color: $light;
  @include desktop-s {
    padding: 2rem;
  }
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 24rem;
  }
}
</style>
