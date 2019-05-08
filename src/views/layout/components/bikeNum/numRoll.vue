<template>
  <div class="test-num-roll">
    <transition name="slide-fade">
      <button @click="show = !show"
              key="save"
              v-if="show">
        0
      </button>
      <button @click="show = !show"
              key="edit"
              v-else>
        1
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 720000
    }
  },
  data() {
    return {
      show: true
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
