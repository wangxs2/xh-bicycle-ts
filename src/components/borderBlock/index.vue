<template>
  <div class="quadrangle">
    <div class="lt"></div>
    <div class="rt"></div>
    <div class="lb"></div>
    <div class="rb"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class borderBlock extends Vue {
  // @Prop() private msg!: string;
}
</script>

<style lang="scss" scoped>
.quadrangle {
  box-sizing: border-box;
  box-shadow: 0px 0px vh(20) vh(0.8) rgba(153, 204, 255, 0.2) inset;
  border: 1px solid rgba(153, 204, 255, 0.25);
  border-radius: vh(2);
  width: 100%;
  height: 100%;
  position: relative;
  .lt,
  .rt,
  .lb,
  .rb {
    position: absolute;
    width: vw(4);
    height: vh(4);
  }
  .lt {
    left: -1px;
    top: -1px;
    border-left: 1px solid #7fbfff;
    border-top: 1px solid #7fbfff;
    border-radius: vw(3) 0 0 0;
  }
  .rt {
    right: -1px;
    top: -1px;
    border-right: 1px solid #7fbfff;
    border-top: 1px solid #7fbfff;
    border-radius: 0 vw(3) 0 0;
  }
  .lb {
    left: -1px;
    bottom: -1px;
    border-left: 1px solid #7fbfff;
    border-bottom: 1px solid #7fbfff;
    border-radius: 0 0 0 vw(3);
  }
  .rb {
    right: -1px;
    bottom: -1px;
    border-right: 1px solid #7fbfff;
    border-bottom: 1px solid #7fbfff;
    border-radius: 0 0 vw(3) 0;
  }
}
</style>
