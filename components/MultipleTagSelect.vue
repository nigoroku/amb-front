<template>
  <a-select
    v-model="selected"
    mode="tags"
    style="width: 100%"
    placeholder="select category..."
    @change="handleChange"
  >
    <a-select-option
      v-for="c in categories"
      :key="String(c.category_id)"
      :value="String(c.category_id)"
      :style="{color: c.color_code}"
    >{{ c.name }}</a-select-option>
  </a-select>
</template>
<script>
export default {
  data() {
    return {
      selected: [],
    };
  },
  props: ["categories", "default_categories"],
  methods: {
    handleChange(value) {
      this.$emit("select", `${value}`);
    },
  },
  mounted: function () {
    this.selected = this.default_categories;
  },
};
</script>
