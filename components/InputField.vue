<template>
  <b-field class="mb-0">
    <a-checkbox v-model="todo.checked" class="ml-5"></a-checkbox>
    <a-input
      placeholder="Basic usage"
      :value="todo.details"
      :name="'route[' + todo.id + '][details]'"
      class="pl-0 column is-11 pt-5 pb-5"
    ></a-input>
  </b-field>
</template>
<script>
export default {
  props: ["todo"]
};
</script>