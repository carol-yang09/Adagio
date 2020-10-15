<template>
  <div>
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="pagebanner pagebanner-img">
      <h2>關於我們</h2>
    </div>

    <div class="brand">
      <div class="brand-about" data-aos="zoom-in" data-aos-duration="1000">
        <h3 class="brand-title">關於 Adagio</h3>
        <p class="brand-text">
          Adagio 代表音樂中的慢板，在義大利文裡是緩慢而從容的意思，在這快節奏的是世界裡，
          適時地慢下來，留一點時間給自己，才能細細品味的生活。
        </p>
      </div>
      <div class="brand-idea">
        <div class="idea-content" data-aos="zoom-in" data-aos-duration="1000">
          <h3 class="brand-title">經營理念</h3>
          <p class="brand-text">
            Adagio 堅持以「專業、誠信、服務、品質」的經營理念，我們用最真誠的態度
            ，打造美味的佳餚，讓您來到 Adagio 都能有賓至如歸的感受。
          </p>
        </div>
        <div class="idea-img"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      isLoading: false,
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
  background: $light;
  text-align: center;
}

.brand-title {
  display: inline-block;
  margin-bottom: 1.5rem;
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

.brand-about {
  padding: 5rem 0;
  background: linear-gradient(90deg, $light 50%, $white 50%);
  @include pad {
    padding: 7rem 0;
  }
}

.brand-idea {
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, $white 50%, $light 50%);
  @include pad {
    flex-direction: row;
  }
}

.idea-content {
  width: 100%;
  margin: 0 auto;
  padding: 5rem 0;
  @include pad {
    width: 50%;
    padding: 7rem 0;
  }
}

.idea-img {
  flex: 1;
  min-height: 20rem;
  margin: 0;
  background: url('../../assets/images/about.jpg') center center no-repeat;
  background-size: cover;
  @include pad {
    margin: 2rem;
  }
}
</style>
