<template>
  <a-layout id="components-layout-demo-custom-trigger" style="height: 100%">
    <a-layout>
      <transition name="top" mode="out-in">
        <a-alert
          v-show="isShowAlert"
          message="本日の実績を登録しました！"
          description="明日もまたがんばりましょう！"
          type="success"
          closable
          show-icon
          class="alert-message"
        />
      </transition>
      <headers @isCollapsed="collapsed = !collapsed"></headers>
      <div class="content">
        <Nuxt />
      </div>
    </a-layout>
  </a-layout>
</template>
<script>
import Headers from "@/components/Headers";
import { mapState } from "vuex";

export default {
  middleware: "pageId",
  components: {
    Headers,
  },
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    ...mapState(["isShowAlert", "currentPage"]),
  },
};
</script>
<style lang="less">
#__nuxt {
  height: 100%;
}
#__layout {
  height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.system-logo {
  background: bottom;
  img {
    width: 190px;
    padding: 10px 20px 10px 20px;
  }
}

.alert-message {
  position: fixed;
  width: 80%;
  left: 240px;
  top: 55px;
  z-index: 100;
}

.top-enter-active,
.top-leave-active {
  transform: translate(0px, 0px);
  transition: transform 500ms cubic-bezier(0, 0, 0.2, 1) 500ms;
}

.top-enter,
.top-leave-to {
  transform: translateY(-100vh) translateY(0px);
}

.content {
  padding: 24px;
  background: #444c57;
}
</style>
