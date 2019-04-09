<template>
  <div class="viewPage">
    <div class="page-top">
      <page-top></page-top>
    </div>
    <div class="page-content">
      <div class="cont-left">

        <div class="cont-tit">
          <img src="~@img/left@2x.png">
          <div class="cont-text">共享单车基础数据</div>
          <img src="~@img/right@2x.png">
        </div>

        <div class="cont-basics-data">
          <div class="tab-block-2">
            <div class="tab-block-4">
              <border-block>
                <bikeNum></bikeNum>
              </border-block>
            </div>
            <div class="tab-block-4">
              <border-block>
                <rank-block :rank-data='activeRange'
                            :gradient-ramp="['#6ad4ff','#5a60ff']"
                            block-tit='活跃区域 TOP10'
                            font-color="#20c0fe">
                </rank-block>
              </border-block>
            </div>
          </div>
          <div class="tab-block-2">
            <div class="tab-block-4">
              <border-block>
                <rank-block :rank-data='morningTop'
                            :gradient-ramp="['#f1d351','#ff8033']"
                            block-tit='早高峰区域 TOP10'
                            font-color="#ff8133">
                </rank-block>
              </border-block>
            </div>
            <div class="tab-block-4">
              <border-block>
                <rank-block :rank-data='eveningTop'
                            :gradient-ramp="['#a59cff','#fc76ff']"
                            block-tit='晚高峰区域 TOP10'
                            font-color="#fb76ff">
                </rank-block>
              </border-block>
            </div>
          </div>
        </div>

        <div class="cont-tit mg-top-4">
          <img src="~@img/left@2x.png">
          <div class="cont-text">共享单车工单</div>
          <img src="~@img/right@2x.png">
        </div>

        <div class="cont-work-order">
          <border-block>
            <work-order-details></work-order-details>
          </border-block>
        </div>

      </div>
      <div class="cont-center">

        <div class="cont-tit">
          <div class="cont-text">徐汇区共享单车实时分布情况</div>
        </div>

        <div class="map">
          <myMap></myMap>
        </div>

      </div>
      <div class="cont-right">

        <div class="work-order-data">
          <div class="cont-tit">
            <img src="~@img/left@2x.png">
            <div class="cont-text">共享单车工单</div>
            <img src="~@img/right@2x.png">
          </div>

          <div class="order-situation">
            <border-block>
              <order-situation></order-situation>
            </border-block>
          </div>

          <div class="order-disposal">
            <border-block>
              <work-dispose></work-dispose>
            </border-block>
          </div>
        </div>

        <div class="command-handle">
          <div class="cont-tit">
            <img src="~@img/left-arrow.png"
                 class="small-arrow left-arrow">
            <img src="~@img/left@2x.png">
            <div class="cont-text">指挥督办</div>
            <img src="~@img/right@2x.png">
            <img src="~@img/right-arrow.png"
                 class="small-arrow right-arrow">
          </div>

          <div class="commandbox">
            <command :townData="townData"></command>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import pageTop from "./components/top/index";
import borderBlock from "@/components/borderBlock/index.vue";
import bikeNum from "./components/bikeNum/index";
import rankBlock from "@/components/rankBlock/index.vue";
import workOrderDetails from "./components/workOrderDetails/index";
import myMap from "./components/myMap/index";
import orderSituation from "./components/ordersituation/index";
import workDispose from "./components/workDispose/index";
import command from "./components/command/index";

import { Component, Vue } from "vue-property-decorator";
import API from "@/api/index";
import { refinedCal, cloneObj } from "@/libs/util.ts";
import moment from "moment";

moment.locale("zh-cn");

@Component({
  components: {
    pageTop,
    borderBlock,
    bikeNum,
    rankBlock,
    workOrderDetails,
    myMap,
    orderSituation,
    workDispose,
    command
  }
})
export default class Layout extends Vue {
  // 重点区排名数据
  private activeRange: Array<{}> = [];
  // 早高峰排名数据
  private morningTop: Array<{}> = [];
  // 晚高峰排名数据
  private eveningTop: Array<{}> = [];
  // 街镇数据
  private townData: Array<{}> = [];

  created() {
    this.getKeyArea();
    this.getPeakRanking();
  }

  // 获取重点区域排名
  private getKeyArea(): void {
    API.getKeyArea().then(
      (res: any): void => {
        if (res.status === 0) {
          this.townData = cloneObj(res.activeRange);
          res.activeRange = res.activeRange.slice(0, 10);

          this.activeRange = res.activeRange.map(
            (item: any, index: number): object => {
              item.percentage = refinedCal(`${item.activeRate}*100`, -1) + "%";
              item.index = index + 1;
              item.name = item.orgName;
              item.describe = item.percentage;
              return item;
            }
          );
        }
      }
    );
  }

  // 早晚高峰 获取数据
  private getPeakRanking(): void {
    // 昨天
    const yesterday = moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD");

    // const yesterday = "2019-03-22";

    // 重点区域 早高峰
    const morningStartTime = yesterday + " 08:30:00";
    const morningEndTime = yesterday + " 09:30:00";
    API.getPeak(morningStartTime, morningEndTime).then(
      (res: any): void => {
        if (res.data.length) {
          this.disPeak(res.data, 1);
        }
      }
    );

    // 重点区域 晚高峰
    const eveningStartTime = yesterday + " 17:30:00";
    const eveningEndTime = yesterday + " 18:30:00";
    API.getPeak(eveningStartTime, eveningEndTime).then(
      (res: any): void => {
        if (res.data.length) {
          this.disPeak(res.data, 2);
        }
      }
    );
  }

  // 处理早晚高峰数据
  private disPeak(data: Array<{}>, type: number): void {
    // TOP10
    const topData: Array<any> = data.slice(0, 10);

    // 最大数
    const maxBikeNum: string | number = topData[0].bicycleNum;

    // 比例计算
    let percentage: string | number = "";

    const typeData: Array<{}> = topData.map(
      (item: any, index: number): object => {
        percentage = refinedCal(`(${item.bicycleNum}/${maxBikeNum})*100`, 2);

        item.percentage = percentage + "%";
        item.index = index + 1;
        item.name = item.regionName;
        item.describe = item.bicycleNum + "辆";

        return item;
      }
    );

    if (type === 1) {
      this.morningTop = typeData;
    } else {
      this.eveningTop = typeData;
    }
  }
}
</script>

<style lang="scss" scoped>
.viewPage {
  width: 100%;
  height: 100%;
  background: #232434;
  padding: 0 vw(10);
  padding-top: 0;
  box-sizing: border-box;
  .page-top {
    width: 100%;
    height: vh(50);
  }
  .page-content {
    width: 100%;
    height: vh(480);
    display: flex;
    .cont-tit {
      width: 100%;
      height: vh(30);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #20c0fe;
      font-size: vw(12);
      position: relative;
      div.cont-text {
        margin: 0 vw(8);
      }
      img {
        width: vw(14);
        height: vw(10);
      }
      .small-arrow {
        outline: none;
        position: absolute;
        width: vw(7);
        height: vw(11);
        cursor: pointer;
        &:first-of-type {
          left: 0;
        }
        &:last-of-type {
          right: 0;
        }
      }
    }
    .mg-top-4 {
      margin-top: vh(4);
    }
    .cont-left {
      width: vw(460);
      height: 100%;
      .cont-basics-data {
        width: 100%;
        height: vh(310);
        .tab-block-2 {
          width: 100%;
          height: vh(150);
          display: flex;
          &:nth-of-type(2) {
            margin-top: vh(10);
          }
          .tab-block-4 {
            width: vw(225);
            height: 100%;
            &:nth-of-type(2) {
              margin-left: vw(10);
            }
          }
        }
      }
      .cont-work-order {
        width: 100%;
        height: vh(105);
      }
    }
    .cont-center {
      width: 1px;
      flex: 1;
      height: 100%;
      margin: 0 vw(10);
      display: flex;
      flex-direction: column;
      .map {
        width: 100%;
        height: 1px;
        flex: 1;
        box-shadow: 0px 0px vh(20) vh(0.8) rgba(153, 204, 255, 0.2) inset;
        border-radius: vh(2);
      }
    }
    .cont-right {
      width: vw(460);
      height: 100%;
      display: flex;
      .work-order-data {
        width: vw(225);
        height: 100%;
        .order-situation {
          width: 100%;
          height: vh(290);
        }
        .order-disposal {
          width: 100%;
          margin-top: vh(10);
          height: vh(150);
        }
      }
      .command-handle {
        margin-left: vw(10);
        width: vw(225);
        height: 100%;
        display: flex;
        flex-direction: column;
        .commandbox {
          width: 100%;
          height: 1px;
          flex: 1;
        }
      }
    }
  }
}
</style>
