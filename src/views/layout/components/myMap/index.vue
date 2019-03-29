<template>
  <div class="my-map">
    <div id="mapContainer"></div>

    <!-- 设置按钮 S -->
    <div class="setting-btn"
         @click="settingShow = !settingShow">
      <img src="@img/icon_display_pre@3x.png"
           draggable="false"
           v-if="settingShow">
      <img src="@img/icon_display_nor@3x.png"
           draggable="false"
           v-else>
      <span>显示设置</span>
    </div>
    <!-- 设置按钮 E -->

    <!-- 设置内容 S -->
    <div class="setting-content"
         v-show="settingShow">
      <div class="area-name">
        <img src="@img/select_pre.png"
             draggable="false">
        <span>徐汇区</span>
      </div>

      <!-- 企业 -->
      <div class="enterprises">
        <div class="enterprise-item"
             @click="selectEnterprise(item.code)"
             v-for="(item,index) in enterpriseData"
             :key="index">
          <img src="@img/select_pre.png"
               draggable="false"
               v-if="selectEnterpriseCode === item.code">
          <img src="@img/select_nor.png"
               draggable="false"
               v-else>
          <span>{{item.name}}</span>
        </div>
      </div>
      <!-- 企业 -->

      <!-- 设置项 -->
      <div class="setting-selects">
        <div class="selects-item"
             v-for="(item,index) in settingItemData"
             @click="selectSetItem(item)"
             :key="index">
          <img src="@img/select_pre1.png"
               draggable="false"
               v-if="item.state">
          <img src="@img/select_nor1.png"
               draggable="false"
               v-else>
          <span>{{item.name}}</span>
        </div>
      </div>
      <!-- 设置项 -->
    </div>
    <!-- 设置内容 E -->

    <!-- 工单详情 S -->
    <div class="workOrder-details"
         v-if="isShowWorkOrderDispose">
      <div class="workOrder-details-close iconfont icon-guanbi"
           @click="isShowWorkOrderDispose = false">
      </div>
      <div class="details-status">{{workOrderDisposeData.nowStatus}}</div>
      <div class="imgs">
        <slideshow v-if="isShowWorkOrderDispose"
                   parendClassName="workOrder-details"
                   :options="workOrderDisposeOptions">
          <div class="swiper-slide"
               v-for="(item,index) in workOrderDisposeData.detailsImgs"
               :key="index">
            <div class="img-item">
              <img :src="item.url">
              <div class="img-watermark">{{item.text}}</div>
            </div>
          </div>
        </slideshow>
      </div>
      <div class="details-text">
        <p v-for="(item,index) in workOrderDisposeData.detailsTexts"
           :key="index">
          <span>{{item.key}}：</span>
          <span>{{item.val}}</span>
        </p>
      </div>
      <div class="dispose-status">{{workOrderDisposeData.despatchStatus}}</div>
    </div>
    <!-- 工单详情 E -->
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>