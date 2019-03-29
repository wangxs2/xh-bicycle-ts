<template>
  <div class="bike-num">
    <!-- 投放量 start-->
    <div class="sum-item">
      <div class="select-org"
           @mousemove="moveEventSelectOrg(1)"
           @mouseleave="leaveEventSelectOrg(1)">
        <div class="select-org-icon"></div>
        <div>{{putInNumDate[putInSelect].companyName}}-投放量</div>

        <div class="put-in-select-box"
             v-show="putInSelectFlag">
          <div class="put-in-select">
            <div class="triangle-up"></div>
            <p v-for="(item,index) in putInNumDate"
               @click="putInSelect = index"
               :class="[index === putInSelect? 'active':'']"
               :key="item.index">{{item.companyName}}</p>
          </div>
        </div>
      </div>
      <div class="bike-num-box"
           style="color:#FFFF50;">
        <div v-for="(item,index) in putInNumDate[putInSelect].bicycleNum"
             :key="index"
             :class="[item === ',' ? 'punctuation-num' : 'border-num']">
          {{item}}
        </div>
        <div class="unit">辆</div>
      </div>
    </div>
    <!-- 投放量 end-->

    <!-- 周活跃量 start-->
    <div class="sum-item">
      <div class="select-org"
           @mousemove="moveEventSelectOrg(2)"
           @mouseleave="leaveEventSelectOrg(2)">
        <div class="select-org-icon"></div>
        <div>{{weekActiveNumDate[weekActiveSelect].companyName}}-周活跃量</div>

        <div class="put-in-select-box"
             v-show="weekActiveSelectFlag">
          <div class="put-in-select">
            <div class="triangle-up"></div>
            <p v-for="(item,index) in weekActiveNumDate"
               @click="weekActiveSelect = index"
               :class="[index === weekActiveSelect? 'active':'']"
               :key="item.id">{{item.companyName}}</p>
          </div>
        </div>
      </div>
      <div class="bike-num-box"
           style="color:#00FFA4;">
        <div v-for="(item,index) in weekActiveNumDate[weekActiveSelect].activeNum"
             :key="index"
             :class="[item === ',' ? 'punctuation-num' : 'border-num']">
          {{item}}
        </div>
        <div class="unit">辆</div>
      </div>
    </div>
    <!-- 周活跃量 end-->
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped src="./index.scss"></style>