<template>
  <div class="my-map" ref="fullScreenTarget">
    <div id="mapContainer"></div>

    <!-- 全屏按钮 S -->
    <div class="full-screen-btn" @click="fullScreen">
      <i class="iconfont icon-quanping1"></i>
    </div>
    <!-- 全屏按钮 E -->

    <!-- 设置按钮 S -->
    <div class="setting-btn" @click="settingShow = !settingShow">
      <img src="@img/icon_display_pre@3x.png" draggable="false" v-if="settingShow">
      <img src="@img/icon_display_nor@3x.png" draggable="false" v-else>
      <span>显示设置</span>
    </div>
    <!-- 设置按钮 E -->

    <!-- 设置内容 S -->
    <transition
      name="from-above-down"
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOutRight"
    >
      <div class="setting-content" v-show="settingShow">
        <!-- 企业 -->
        <div class="area-enterprises">
          <div class="area-name">徐汇区</div>
          <div class="enterprises" @click="isShowEnterprise = !isShowEnterprise">
            <span>{{selectEnterpriseName}}</span>
            <i class="iconfont icon-arrLeft-fill drop-down" :class="{active:isShowEnterprise}"></i>
          </div>

          <transition name="fade">
            <div class="drop-down-select" v-show="isShowEnterprise">
              <div class="triangle-up"></div>
              <ul class="select-box">
                <li
                  v-for="item in enterpriseData"
                  @click="selectEnterprise(item.code,item.name)"
                  :key="item.code"
                  :class="{active :selectEnterpriseCode === item.code}"
                >
                  <span>{{item.name}}</span>
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <!-- 企业 -->

        <!-- 设置项 -->
        <div class="setting-selects">
          <div
            class="selects-item"
            v-for="(item,index) in settingItemData"
            @click="selectSetItem(item)"
            :key="index"
          >
            <img src="@img/select_pre1.png" draggable="false" v-if="item.state">
            <img src="@img/select_nor1.png" draggable="false" v-else>
            <span>{{item.name}}</span>
          </div>
        </div>
        <!-- 设置项 -->
      </div>
    </transition>
    <!-- 设置内容 E -->

    <!-- 工单详情 S -->
    <transition name="fade">
      <div class="workOrder-details" v-if="isShowWorkOrderDispose">
        <div
          class="workOrder-details-close iconfont icon-guanbi"
          @click="isShowWorkOrderDispose = false"
        ></div>
        <div class="details-status">{{workOrderDisposeData.nowStatus}}</div>
        <div class="imgs">
          <slideshow
            v-if="isShowWorkOrderDispose"
            parendClassName="workOrder-details"
            :options="workOrderDisposeOptions"
          >
            <div
              class="swiper-slide"
              v-for="(item,index) in workOrderDisposeData.detailsImgs"
              :key="index"
            >
              <div class="img-item">
                <img :src="item.url">
                <div class="img-watermark">{{item.text}}</div>
              </div>
            </div>
          </slideshow>
        </div>
        <div class="details-text">
          <p v-for="(item,index) in workOrderDisposeData.detailsTexts" :key="index">
            <span>{{item.key}}：</span>
            <span>{{item.val}}</span>
          </p>
        </div>
        <div class="dispose-status">{{workOrderDisposeData.despatchStatus}}</div>
      </div>
    </transition>
    <!-- 工单详情 E -->

    <!-- 治理轮循 S -->
    <transition name="fade">
      <div class="workOrders" v-if="isShowRoundRobinData">
        <slideshow parendClassName="workOrders" :options="roundRobinOptions">
          <div class="swiper-slide" v-for="(item,index) in roundRobinData" :key="index">
            <div class="workOrder-item">
              <div class="details-status">{{item.nowStatus}}</div>
              <div class="imgs">
                <img :src="item.roundRobinimg">
              </div>
              <div class="details-text">
                <p v-for="(subItem,SubIndex) in item.detailsTexts" :key="SubIndex">
                  <span>{{subItem.key}}：</span>
                  <span>{{subItem.val}}</span>
                </p>
              </div>
              <div class="dispose-status">{{item.despatchStatus}}</div>
            </div>
          </div>
        </slideshow>
      </div>
    </transition>
    <!-- 治理轮循 E -->

    <!-- 预警播报 S -->
    <transition name="fade">
      <early-warning v-if="isEarlyWarning"></early-warning>
    </transition>
    <!-- 预警播报 E -->

    <!-- 区域15天活跃单车趋势 S-->
    <transition name="fade">
      <bicyTrendChart v-if="isBicyTrend" @close="isBicyTrend = false" :params="nowBicyTrendData"></bicyTrendChart>
    </transition>
    <!-- 区域15天活跃单车趋势 E-->

    <!-- 蓝牙嗅探点位信息 S -->
    <transition name="fade">
      <station-info v-if="isBleStatus" @close="isBleStatus = false" :params="BleStationData"></station-info>
    </transition>
    <!-- 蓝牙嗅探点位信息 E -->

    <!-- 蓝牙嗅探统计 S -->
    <transition name="fade">
      <blu-statistics
        v-if="isBleStatistics"
        @close="isBleStatistics = false"
        :params="BleStationData"
      ></blu-statistics>
    </transition>
    <!-- 蓝牙嗅探统计 E -->

    <!-- 蓝牙嗅探检测到的车辆 S -->
    <transition name="fade">
      <bleCheck-table v-if="isBleBickList" @close="isBleBickList = false" :params="BleStationData"></bleCheck-table>
    </transition>
    <!-- 蓝牙嗅探检测到的车辆 E -->

    <!-- 僵尸车统计 S -->
    <transition name="fade">
      <bad-bicy-statistics
        v-if="isBleBadStatistics"
        @close="isBleBadStatistics = false"
        :params="BleStationData"
      ></bad-bicy-statistics>
    </transition>
    <!-- 僵尸车统计 E -->

    <!-- 人员位置信息 S -->
    <transition name="fade">
      <staff-position v-if="isStaffData" @close="isStaffData = false" :params="StaffData"></staff-position>
    </transition>
    <!-- 人员位置信息 E -->

    <!-- 人员图例 S -->
    <transition name="fade">
      <div class="staff-legend" v-if="isShowStaffLegend">
        <div
          class="legend-item"
          @click="screenItem(item.code)"
          :class="{sub:item.type == 'children',active: staffTypeSelect === item.code}"
          v-for="(item,index) in staffLegendData"
          :key="index"
        >
          <div class="legend-icon">
            <img :src="item.icon" :class="{small:item.size == 'small'}">
          </div>
          <span>{{item.name}}: {{staffTypeDate[item.code]}}</span>
        </div>
      </div>
    </transition>
    <!-- 人员图例 E -->

    <!-- 工单图例 S -->
    <transition name="fade">
      <div class="map-legend" @mouseleave="isShowLegendTab = false" v-if="isShowLegend">
        <div
          class="legend-item"
          @click="showLegendTable(index)"
          v-for="(item,index) in legendData"
          :key="index"
        >
          <img :src="item.icon">
          <span>{{item.name}}</span>
        </div>

        <div class="workOrder-tab" v-show="isShowLegendTab">
          <div class="slide-box">
            <div class="tab-head">
              <div
                :style="{width: item.width + '%'}"
                v-for="(item,index) in legendTabHead[selectLegend]"
                :key="index"
              >
                <span>{{item.name}}</span>
              </div>
            </div>
            <div class="tab-body">
              <div
                class="tab-item"
                v-for="(item,index) in sheetWorkOrder[selectLegend]"
                :key="index"
              >
                <div
                  :style="{width: legendTabHead[selectLegend][subindex].width + '%'}"
                  v-for="(subItem,subindex) in item"
                  :key="subindex"
                >
                  <span>{{subItem}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 工单图例 E -->
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>

<style lang="scss">
.my-map {
  .station-func-box {
    width: 54px;
    height: 54px;
    position: relative;
    background: url('~@img/station@3x.png') no-repeat;
    background-size: 100% 100%;
  }
  .point-location {
    position: absolute;
    width: 22px;
    height: 22px;
    top: -11px;
    left: 50%;
    margin-left: -11px;
    background: url('~@img/point_loca@3x.png') no-repeat;
    background-size: 100% 100%;
  }
  .list-info {
    position: absolute;
    width: 22px;
    height: 22px;
    top: 50%;
    right: -11px;
    margin-top: -11px;
    background: url('~@img/list_info@3x.png') no-repeat;
    background-size: 100% 100%;
  }
  .statistics {
    position: absolute;
    width: 22px;
    height: 22px;
    bottom: -11px;
    left: 50%;
    margin-left: -11px;
    background: url('~@img/statistics@3x.png') no-repeat;
    background-size: 100% 100%;
  }
  .bad {
    position: absolute;
    width: 22px;
    height: 22px;
    top: 50%;
    left: -11px;
    margin-top: -11px;
    background: url('~@img/bad@3x.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
