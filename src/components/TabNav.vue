<template>
  <div>
    <ul class="nav nav-tabs">
      <li v-for="tab in tabs" :key="tab" class="nav-item">
        <a href="#" class="nav-link" :class="{ active: tab === selected }" @click="setTab(tab)">
          {{ tab }}
        </a>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabNav",
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
  },
  methods: {
    setTab(tab) {
      this.$emit("selected", tab);
    },
  },
};
</script>
<style scoped>
</style>