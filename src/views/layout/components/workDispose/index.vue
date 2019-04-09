<template>
  <div class="workdis">
    <div class="workdis-tit">企业工单处置率</div>
    <div class="workOrderBox">
      <div class="workOrderBox-item">
        <div class="echart-content"
             id="disContainer1"></div>
        <div class="name-text">{{roughHandlingItem[0]?roughHandlingItem[0].name:"-"}}</div>
      </div>
      <div class="workOrderBox-item">
        <div class="echart-content"
             id="disContainer2"></div>
        <div class="name-text">{{roughHandlingItem[1]?roughHandlingItem[1].name:"-"}}</div>
      </div>
      <div class="workOrderBox-item">
        <div class="echart-content"
             id="disContainer3"></div>
        <div class="name-text">{{roughHandlingItem[2]?roughHandlingItem[2].name:"-"}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>