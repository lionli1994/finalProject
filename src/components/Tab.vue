<template>
  <div v-if="isSelected">
    <slot></slot>
  </div>
</template>
<script >
export default {
  name: "TabTag",
  props: {
    isSelected: {
      type: Boolean,
    },
  },
};
</script>
<style>
</style>