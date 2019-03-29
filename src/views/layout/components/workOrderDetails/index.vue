<template>
  <!-- 工单详情 -->
  <div class="work-order-details">
    <div class="details-tab">
      <div class="tab-head">
        <div style="width: 22%">时间</div>
        <div style="width: 30%">地址</div>
        <div style="width: 22%">描述</div>
        <div style="width: 16%">推送单位</div>
        <div style="width: 10%">状态</div>
      </div>
      <div class="tab-body">
        <transition-group name="list-complete"
                          tag="div">
          <div class="details-item"
               v-for="item in workOrderData"
               :key="item.index">
            <div style="width: 22%;color:#fff;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.time}}</div>
            <div style="width: 30%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.dir}}</div>
            <div style="width: 22%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.des}}</div>
            <div style="width: 16%">{{item.org}}</div>
            <div style="width: 10%">{{item.status}}</div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>
