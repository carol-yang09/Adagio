<template>
  <div class="main about">
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="pagebanner"></div>

    <div class="brand">
      <div class="brand-about">
        <h3 class="brand-title">關於 Adagio</h3>
        <p class="brand-text">
          Adagio 代表音樂中的慢板，在義大利文裡是緩慢而從容的意思，在這快節奏的是世界裡，
          適時地慢下來，留一點時間給自己，才能細細品味的生活。
        </p>
      </div>
      <div class="brand-idea">
        <div class="idea-content">
          <h3 class="brand-title">經營理念</h3>
          <p class="brand-text">
            Adagio 堅持以「專業、誠信、服務、品質」的經營理念，我們用最真誠的態度
            ，打造美味的佳餚，讓您來到 Adagio 都能有賓至如歸的感受。
          </p>
        </div>
        <div class="idea-img" data-aos="zoom-in" data-aos-duration="3000"></div>
      </div>
    </div>

    <div class="container contact">
      <div>
        <h3 class="message">
          留言給我們
          <span class="message-arrow">
            <i class="fas fa-angle-double-right"></i>
          </span>
        </h3>
        <div class="info">
          <ul class="">
            <li class="logo">Adagio</li>
            <li>TEL： 12345678910</li>
            <li>Mail： adagio@mail.com</li>
            <li>地址： 台北市信義區信義路五段7號1樓</li>
          </ul>
        </div>
      </div>

      <ValidationObserver class="contact-form" v-slot="{ invalid }" tag="form"
        @submit.prevent="sendMessage()" data-aos="fade-up" data-aos-duration="3000">

        <ValidationProvider class="form-group" name="姓名" rules="required" tag="div"
          v-slot="{ errors, classes }">
          <label for="name">姓名：</label>
          <input type="text" id="name" class="form-control" placeholder="請輸入姓名"
          :class="classes" v-model="tempData.name" required>
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider class="form-group" name="電話" rules="required" tag="div"
          v-slot="{ errors, classes }">
          <label for="tel">電話：</label>
          <input type="text" id="tel" class="form-control" placeholder="請輸入電話"
          :class="classes" v-model="tempData.tel" required>
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider class="form-group" name="電子郵件" rules="required|email" tag="div"
          v-slot="{ errors, classes }">
          <label for="email">電子郵件：</label>
          <input type="email" id="email" class="form-control" placeholder="請輸入電子郵件"
          :class="classes" v-model="tempData.email" required>
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider class="form-group" name="留言" rules="required" tag="div"
          v-slot="{ errors, classes }">
          <label for="message">留言：</label>
          <textarea class="form-control" id="message" rows="3" placeholder="留言給我們"
          :class="classes" v-model="tempData.message" required></textarea>
          <span class="invalid-feedback">{{ errors[0] }}</span>
        </ValidationProvider>

        <div class="text-center">
          <button type="submit" class="btn btn-dark" :disabled="invalid">送出</button>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      isLoading: false,
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
        icon: 'success',
        title: '感謝您',
        text: '謝謝您的回饋，我們已收到',
      };
      vm.$bus.$emit('alertmessage', msg, 'modal');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.pagebanner {
  min-height: 15rem;
  background: url('../../assets/images/pagebanner.jpg') center no-repeat;
  background-size: cover;
  @include pad {
    min-height: 20rem;
  }
}

.brand {
  margin-bottom: 4rem;
  text-align: center;
}

.brand-title {
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.brand-text {
  max-width: 19rem;
  margin: 0 auto;
  line-height: 1.75;
  letter-spacing: 1px;
}

.brand-about {
  padding: 5rem 0;
  background: linear-gradient(90deg, $light 50%, $white 50%);
}

.brand-idea {
  display: flex;
  flex-direction: column;
  @include pad {
    flex-direction: row;
  }
}

.idea-content {
  flex: 1;
  padding: 5rem 0;
  @include pad {
    padding: 8rem 0;
    background: linear-gradient(0deg, $white 80%, $light 20%);
  }
}

.idea-img {
  flex: 1;
  padding: 8rem 0;
  background: url('../../assets/images/about.jpg') center center no-repeat;
  background-size: cover;

}

.contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
  text-align: center;
  @include pad {
    flex-direction: row;
  }
}

.message {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  @include pad {
    margin-bottom: 2rem;
  }
}

.message-arrow {
  display: none;
  animation: moveRight 3s infinite;
  @include pad {
    display: inline-block;
  }
}

.info {
  position: relative;
  margin-bottom: 2rem;
  background-color: $info;
  border: 2px solid $dark;
  border-radius: 0.25rem;
  &:before {
    content: "";
    display: none;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 100%;
    height: 100%;
    background-color: $secondary;
    border-radius: 0.25rem;
    z-index: -1;
  }
  @include mobile-s {
    margin-left: 2rem;
    margin-bottom: 2rem;
    &:before {
      display: block;
    }
  }
  ul {
    padding: 2.5rem;
  }
  li {
    margin-bottom: 0.5rem;
  }
  .logo {
    margin-bottom: 1rem;
    color: $dark;
    font-size: 2rem;
  }
}

.contact-form {
  flex: 1;
  margin-left: 0;
  padding: 1.5rem 1rem;
  width: 100%;
  background-color: $light;
  border: 2px solid $dark;
  border-radius: 0.25rem;
  text-align: left;
  @include pad {
    margin-left: 3rem;
    padding: 1.5rem 2rem;
  }
}

@keyframes moveRight{
  0% {
    transform: translateX(1.5rem);
  }
  50% {
    transform: translateX(3rem);
  }
  100% {
    transform: translateX(1.5rem);
  }
}

</style>
