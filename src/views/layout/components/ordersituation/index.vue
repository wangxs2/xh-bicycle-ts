<template>
  <div class="ordersituation">
    <div class="condition-tit">
      <div>近七天工单情况</div>
      <div class="condition-tit-explain">
        <span>曲线图：自查工单</span>
        <span>柱状图：督办工单</span>
      </div>
    </div>
    <div class="condition-itme"
         id="echartContainer1">
    </div>
    <div class="condition-itme"
         id="echartContainer2">
    </div>
    <div class="condition-itme"
         id="echartContainer3">
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>