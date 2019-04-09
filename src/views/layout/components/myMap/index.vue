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

    <!-- 治理轮循 S -->
    <div class="workOrders"
         v-if="isShowRoundRobinData">
      <slideshow parendClassName="workOrders"
                 :options="roundRobinOptions">
        <div class="swiper-slide"
             v-for="(item,index) in roundRobinData"
             :key="index">
          <div class="workOrder-item">
            <div class="details-status">{{item.nowStatus}}</div>
            <div class="imgs">
              <img :src="item.roundRobinimg">
            </div>
            <div class="details-text">
              <p v-for="(subItem,SubIndex) in item.detailsTexts"
                 :key="SubIndex">
                <span>{{subItem.key}}：</span>
                <span>{{subItem.val}}</span>
              </p>
            </div>
            <div class="dispose-status">{{item.despatchStatus}}</div>
          </div>
        </div>
      </slideshow>
    </div>
    <!-- 治理轮循 E -->

    <!-- 图例 S -->
    <div class="map-legend"
         @mouseleave="isShowLegendTab = false"
         v-if="isShowLegend">
      <div class="legend-item"
           @click="showLegendTable(index)"
           v-for="(item,index) in legendData"
           :key="index">
        <img :src="item.icon">
        <span>{{item.name}}</span>
      </div>

      <div class="workOrder-tab"
           v-show="isShowLegendTab">
        <div class="slide-box">
          <div class="tab-head">
            <div :style="{width: item.width + '%'}"
                 v-for="(item,index) in legendTabHead[selectLegend]"
                 :key="index">
              <span>{{item.name}}</span>
            </div>
          </div>
          <div class="tab-body">
            <div class="tab-item"
                 v-for="(item,index) in sheetWorkOrder[selectLegend]"
                 :key="index">
              <div :style="{width: legendTabHead[selectLegend][subindex].width + '%'}"
                   v-for="(subItem,subindex) in item"
                   :key="subindex">
                <span>{{subItem}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 图例 E -->
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>