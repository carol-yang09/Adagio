<template>
  <div class="home">
    <div class="banner" id="banner">
      <div class="banner-content">
        <h2 class="banner-title">Adagio</h2>
        <p class="banner-text">
          放慢您的步調，跟著 Adagio 遠離都市喧囂，來場療癒的美食饗宴吧。
        </p>
        <router-link to="/products" class="btn btn-secondary btn-lg border">
          立即選購
          <span class="ml-3">
            <i class="fas fa-store fa-lg"></i>
          </span>
        </router-link>
      </div>
      <div class="banner-rect"></div>
      <a class="banner-scroll" href="#banner" @click.prevent="scrollDown()">
        <img src="../../assets/images/scroll.gif" class="img-fluid">
      </a>
    </div>

    <div class="feature">
      <div class="feature-info" data-aos="zoom-in" data-aos-duration="1000">
        <h2 class="feature-title">
          嚴選食材
        </h2>
        <p class="feature-text">
          Adagio 嚴選每樣用料，謹慎檢驗每道食材，確保新鮮美味，且所有料理堅持現點現做
          ，讓您吃得健康又安心。
        </p>
      </div>
      <ul class="feature-img">
        <li class="feature-img1"></li>
        <li class="feature-img2"></li>
      </ul>
    </div>

    <div class="intro">
      <div class="intro-item intro-img1">
        <router-link class="intro-content"
          :to="{ name: 'Products', query: { categoryName: '主餐' }}">
          <h4 class="intro-title">精選主餐</h4>
          <p class="intro-text">精心製作的餐點，給您充滿視覺與味覺的美食饗宴</p>
        </router-link>
      </div>
      <div class="intro-item intro-img2">
        <router-link class="intro-content"
          :to="{ name: 'Products', query: { categoryName: '甜點' }}">
          <h4 class="intro-title">必吃甜點</h4>
          <p class="intro-text">精緻夢幻甜點，是不容錯過的經典好味道。</p>
        </router-link>
      </div>
      <div class="intro-item intro-img3">
        <router-link class="intro-content"
          :to="{ name: 'Products', query: { categoryName: '飲品' }}">
          <h4 class="intro-title">特調飲品</h4>
          <p class="intro-text">獨家研發的特調黃金比例，值得您來細細品嚐。</p>
        </router-link>
      </div>
    </div>

    <div class="feature">
      <ul class="feature-img">
        <li class="feature-img3"></li>
        <li class="feature-img4"></li>
      </ul>
      <div class="feature-info" data-aos="zoom-in" data-aos-duration="1000">
        <h2 class="feature-title">
          舒適環境
        </h2>
        <p class="feature-text">
          Adagio 位於台北 101 大樓 1 樓，以簡約歐式風格裝潢，打造舒適溫馨的氣氛
          ，讓您在繁忙的生活中，得到療癒的力量。
        </p>
      </div>
    </div>

    <div class="cover">
      <h3 class="logo">Adagio</h3>
      <p>取自義大利文「閒暇」意思，放慢您的步調，跟著 Adagio 享受生活的樂趣。</p>
    </div>

    <div class="feature">
      <div class="feature-info" data-aos="zoom-in" data-aos-duration="1000">
        <h2 class="feature-title">
          顧客回饋
        </h2>
        <p class="feature-text">
          感謝大家對於 Adagio 一路的信任與支持，
          我們會更努力用心做到最完美，來回饋大家的支持及愛護。
        </p>
      </div>
      <div class="feature-swiper">
        <swiper class="swiper" :options="swiperOption">
          <swiper-slide v-for="feedback in feedbacks" :key="feedback.name">
            <div class="swiper-item">
              <div class="star">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <h4 class="feature-title">{{ feedback.name }}</h4>
              <p class="feature-text">{{ feedback.message }}</p>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev swiper-button-custom" slot="button-prev"></div>
          <div class="swiper-button-next swiper-button-custom" slot="button-next"></div>
        </swiper>
      </div>
    </div>

    <div class="map">
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8115.5320544971555!2d121.56105938581133!3d25.032086088602032!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abb6da80a7ad%3A0xacc4d11dc963103c!2z5Y-w5YyXMTAx!5e0!3m2!1szh-TW!2stw!4v1600271959150!5m2!1szh-TW!2stw"
        frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0">
      </iframe>
      <ul class="us">
        <li class="logo">Adagio</li>
        <li>TEL： 12345678910</li>
        <li>Mail： adagio@mail.com</li>
        <li>地址： 台北市信義區信義路五段7號1樓</li>
      </ul>
    </div>

  </div>
</template>

<script>
/* global $ */
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  name: 'Home',
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      feedbacks: [
        {
          name: 'Carol',
          message: 'Adagio 氣氛很好，服務優質，披薩外皮酥脆，下次會再光臨。',
        },
        {
          name: 'Bob',
          message: '空間雖然不大，但服務與餐點都在水準之上。',
        },
        {
          name: 'Casper',
          message: '服務不錯，甜品也令人驚艷，像極了愛情。',
        },
      ],
    };
  },
  methods: {
    scrollDown() {
      const target = $('.banner-scroll').attr('href');
      const targetPos = $(target).offset().top;
      const targetHeigh = $(target).height();
      $('html,body').animate({
        scrollTop: targetHeigh + targetPos,
      }, 1000);
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.home {
  background: url('../../assets/images/banner.jpg') center 85% no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.banner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 100vh;
}

.banner-content {
  max-width: 500px;
  padding: 2rem;
  background-color: rgba($dark, 0.4);
  border-radius: 0.25rem;
  text-align: center;
  color: $white;
  z-index: 99;
  @include mobile {
    padding: 2rem 3rem 3rem;
  }
}

.banner-title {
  margin-bottom: 4rem;
  font-family: $font-logo;
  animation: floating 3s infinite;
  font-size: 3rem;
  font-weight: bold;
  @include mobile {
    margin-bottom: 6rem;
    font-size: 5rem;
  }
}

@keyframes floating{
  0% {
    transform: translateY(1.5rem);
  }
  50% {
    transform: translateY(3rem);
  }
  100% {
    transform: translateY(1.5rem);
  }
}

.banner-text {
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.75;
  @include mobile {
    font-size: 1.25rem;
  }
}

.banner-rect {
  position: absolute;
  width: 20rem;
  height: 10rem;
  bottom: 0;
  right: 0;
  border-style: solid;
  border-width: 0 0 10rem 20rem;
  border-color: transparent transparent $white transparent;
  z-index: 100;
}

.banner-scroll {
  position: absolute;
  right: 0rem;
  bottom: 0rem;
  max-width: 10rem;
  z-index: 101;
}

.feature {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  background-color: $white;
  text-align: center;
  @include mobile {
    padding: 5rem 3rem;
  }
  @include pad {
    flex-direction: row;
  }
}

.feature-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.feature-img {
  flex: 1;
  display: flex;
  min-height: 10rem;
  li {
    flex: 0 0 48%;
    margin: 0 1%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 0.25rem;
  }
}

.feature-img1 {
  background: url('../../assets/images/feature-1.jpg');
}

.feature-img2 {
  background: url('../../assets/images/feature-2.jpg');
}

.feature-img3 {
  background: url('../../assets/images/feature-3.jpg');
}

.feature-img4 {
  background: url('../../assets/images/feature-4.jpg');
}

.feature-title {
  display: inline-block;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid $dark;
  font-size: 1.75rem;
}

.feature-text {
  margin: 0 auto;
  max-width: 20rem;
  line-height: 1.75;
  letter-spacing: 0.25rem;
}

.feature-swiper {
  width: 100%;
  padding: 0 1rem;
  background-color: $info;
  border-radius: 0.25rem;
  @include pad {
    width: 50%;
  }
}

.swiper {
  height: 100%;
}

.swiper-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem 1rem;
  .star {
    margin-bottom: 1.5rem;
  }
}

.intro {
  background-color: $white;
  overflow: hidden;
  @include pad {
    display: flex;
    background-color: transparent;
  }
}

.intro-item {
  position: relative;
  min-height: 25rem;
  margin-bottom: 0.5rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.5s ease;
  text-align: center;
  @include pad {
    flex: 0 0 33.33333%;
    margin-bottom: 0;
  }
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba($dark, 0.8);
    transition: all 0.5s ease;
  }
  &:hover, &:focus {
    transform: scale(1.05);
    &:before {
      background: transparent;
    }
    .intro-content {
      opacity: 0;
    }
  }
}

.intro-img1 {
  background-image: url('../../assets/images/intro-1.jpg');
}

.intro-img2 {
  background-image: url('../../assets/images/intro-2.jpg');
}

.intro-img3 {
  background-image: url('../../assets/images/intro-3.jpg');
}

.intro-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 1rem;
  border: 1px solid $white;
  transition: all 0.5s ease;
  color: $white;
  &:hover {
    text-decoration: none;
  }
}

.intro-title {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid $white;
}

.intro-text {
  max-width: 18rem;
  line-height: 1.75;
  letter-spacing: 0.25rem;
}

.cover {
  padding: 2rem;
  text-align: center;
  color: $white;
  .logo {
    margin-bottom: 2rem;
    font-size: 3rem;
  }
  p {
    font-size: 1.25rem;
    letter-spacing: 0.25rem;
  }
}

.map {
  position: relative;
  iframe {
    display: block;
    width: 100%;
    min-height: 20rem;
  }
}

.us {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 2rem 3rem;
  background-color: $dark;
  border-radius: 0.25rem;
  text-align: center;
  color: $white;
  @include pad {
    display: block;
  }
  li {
    margin-bottom: 0.25rem;
  }
  .logo {
    margin-bottom: 0.75rem;
  }
}
</style>
