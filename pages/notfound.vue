<template>
  <a-result
    status="404"
    title="404"
    sub-title="Sorry, the page you visited does not exist."
  >
    <template #extra>
      <a-button type="primary" @click="toTop">Topへ戻る</a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  layout: "public",
  data() {
    return {};
  },
  methods: {
    toTop() {
      this.$router.push("/");
    },
  },
};
</script>
