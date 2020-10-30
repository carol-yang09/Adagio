<template>
  <div>
    <div class="pagebanner pagebanner-img">
      <h2>關於我們</h2>
    </div>

    <div class="brand">
      <div class="brand-info" data-aos="zoom-in" data-aos-duration="1000">
        <h3 class="brand-title">關於 Adagio</h3>
        <p class="brand-text">
          Adagio 代表音樂中的慢板，在義大利文裡是緩慢而從容的意思，在這快節奏的是世界裡，
          適時地慢下來，留一點時間給自己，才能細細品味的生活。
        </p>
      </div>
      <div class="brand-slider">
        <div class="brand-img"></div>
      </div>
    </div>

    <div class="brand brand-idea">
      <div class="brand-info" data-aos="zoom-in" data-aos-duration="1000">
        <h3 class="brand-title">經營理念</h3>
        <p class="brand-text">
          Adagio 堅持以「專業、誠信、服務、品質」的經營理念，我們用最真誠的態度
          ，打造美味的佳餚，讓您來到 Adagio 都能有賓至如歸的感受。
        </p>
      </div>
      <div class="brand-slider">
        <div class="brand-img"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.pagebanner-img {
  background-image: url('../../assets/images/banner-about.jpg');
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include desktop-s {
    flex-direction: row;
  }
}

@include desktop-s {
  .brand-idea {
    flex-direction: row-reverse;
  }
}

.brand-info {
  width: 100%;
  padding: 3rem 0;
  text-align: center;
  @include desktop-s {
    width: 50%;
  }
}

.brand-title {
  display: inline-block;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid $dark;
  font-size: 1.75rem;
}

.brand-text {
  max-width: 19rem;
  margin: 0 auto;
  line-height: 1.75;
  letter-spacing: 0.25rem;
}

.brand-slider {
  flex: 1;
  width: 100%;
  padding: 1.5rem;
  background-color: $light;
  @include desktop-s {
    padding: 2rem;
  }
}

.brand-img {
  min-height: 24rem;
  background: url('../../assets/images/about.jpg') center center no-repeat;
  background-size: cover;
}
</style>
