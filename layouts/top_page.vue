<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout>
      <headers @isCollapsed="collapsed = !collapsed"></headers>
      <Nuxt />
    </a-layout>
  </a-layout>
</template>
<script>
import Headers from "@/components/Headers";

export default {
  components: {
    Headers,
  },
  data() {
    return {
      collapsed: true,
    };
  },
};
</script>

<style lang="scss" scoped>
// @import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:200, 300);

$prim: #53e3a6;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  font-weight: 300;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
  height: 100%;

  ::-webkit-input-placeholder {
    /* WebKit browsers */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    font-weight: 300;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    opacity: 1;
    font-weight: 300;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    opacity: 1;
    font-weight: 300;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    font-weight: 300;
  }
}

header {
  background: rgba(255, 255, 255, 0.78) !important;
  padding: 0;
  z-index: 30;
}

.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
