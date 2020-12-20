<template>
  <div v-if="loadingNow" class="spinner">
    <div class="cubes">
      <div class="rect rect1"></div>
      <div class="rect rect2"></div>
      <div class="rect rect3"></div>
      <div class="rect rect4"></div>
      <div class="rect rect5"></div>
      <div class="loading-msg">Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "Loading",
  data() {
    return {
      loadingNow: false,
    };
  },
  computed: {
    loading() {
      return this.$store.getters.getLoading;
    },
  },
  methods: {
    start() {
      this.$store.commit("setLoading", true);
    },
    finish() {
      this.$store.commit("setLoading", false);
    },
  },
  watch: {
    loading(val, old) {
      this.loadingNow = val;
    },
  },
});
</script>

<style lang="scss" scoped>
.spinner {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  transition: all 1.2s ease;
  background: rgba(255, 255, 255, 0.7);
  & .loading-msg {
    transform: translate(-50%, -50%);
    font-size: 18px;
    position: absolute;
    left: 30px;
    top: 88px;
  }
}

.cubes {
  position: absolute;
  top: 50%;
  left: 45%;
  height: 70px;
}

.spinner .rect {
  background-color: #333;
  height: 100%;
  width: 6px;
  display: inline-block;
  position: absolute;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
  left: 10px;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
  left: 20px;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
  left: 30px;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
  left: 40px;
}

@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
