<template>
  <div class="early-warning">
    <div class="warning-tit">
      <span>预警播报</span>
      <div class="warning-tenet-btn">
        <span>预警原则</span>
      </div>
    </div>
    <div class="warning-body">
      <div class="warning-box warning-realTime">
        <div class="warning-lable">实时预警</div>
        <div class="warning-content">
          <div class="warning-item">
            <div class="item-lable">下限预警</div>
            <div class="item-des">2018-11-02 13:00 康健新村街道有车辆13000辆，活跃率为46%，已通知企业加强巡查和清运</div>
          </div>
          <div class="warning-item">
            <div class="item-lable">下限预警</div>
            <div class="item-des">2018-11-02 13:00 康健新村街道有车辆13000辆，活跃率为46%，已通知企业加强巡查和清运</div>
          </div>
        </div>
      </div>
      <div class="warning-box warning-history">
        <div class="warning-lable">历史预警</div>
        <div class="warning-content">
          <div class="warning-item">
            <div class="item-lable">下限预警</div>
            <div class="item-des">2018-11-02 13:00 康健新村街道有车辆13000辆，活跃率为46%，已通知企业加强巡查和清运</div>
          </div>
          <div class="warning-item">
            <div class="item-lable">下限预警</div>
            <div class="item-des">2018-11-02 13:00 康健新村街道有车辆13000辆，活跃率为46%，已通知企业加强巡查和清运</div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-tenet">
      <div class="tenet-tit">街镇预警原则</div>
      <table cellpadding='0'
             cellspacing="0">
        <tr>
          <td></td>
          <td colspan="3">区域活跃度</td>
        </tr>
        <tr>
          <td>共享单车与泊位占比</td>
          <td>高(高于45%)</td>
          <td>适中(25%-45%)</td>
          <td>低(低于25%)</td>
        </tr>
        <tr>
          <td>高(高于120%)</td>
          <td>
            <div class="color-lump relieve-limit">蓝</div>
          </td>
          <td>
            <div class="color-lump upper-limit">红</div>
          </td>
          <td>
            <div class="color-lump upper-limit">红</div>
          </td>
        </tr>
        <tr>
          <td>适中(60%-120%)</td>
          <td>
            <div class="color-lump relieve-limit">蓝</div>
          </td>
          <td>
            <div class="color-lump relieve-limit">蓝</div>
          </td>
          <td>
            <div class="color-lump relieve-limit">蓝</div>
          </td>
        </tr>
        <tr>
          <td>低(低于60%)</td>
          <td>
            <div class="color-lump lower-limit">黄</div>
          </td>
          <td>
            <div class="color-lump lower-limit">黄</div>
          </td>
          <td>
            <div class="color-lump relieve-limit">蓝</div>
          </td>
        </tr>
      </table>

      <div class="tenet-legend">
        <div class="legend-icon upper-limit"></div>
        <span>红色:区域状态失衡,需减少车辆---输出</span>
      </div>
      <div class="tenet-legend">
        <div class="legend-icon relieve-limit"></div>
        <span>蓝色:区域状态平衡---正常</span>
      </div>
      <div class="tenet-legend">
        <div class="legend-icon lower-limit"></div>
        <span>黄色:区域状态失衡,需增加车辆---输入</span>
      </div>
    </div>

    <div class="warning-details">
      <div class="type-date">
        <div class="type">下限预警</div>
        <span>2018-11-01 13:00</span>
      </div>

      <p>徐家汇街道有车辆5000辆，活跃率为36%</p>
      <p>低于泊位阀值6000个泊位并活跃率高于25%</p>
      <p>建议企业增加投放</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import API from "@/api/index.ts";
import moment from "moment";

moment.locale("zh-cn");

@Component({})
export default class EarlyWarning extends Vue {
  mounted() {
    this.getWaring();
  }

  public getWaring(): void {
    API.getWaring({
      startTime: "2019-04-27 00:00:00",
      endTime: "2019-04-30 23:59:59"
    }).then(
      (res: any): void => {
        console.log(res);
      }
    );
  }
}
</script>


<style lang="scss" scoped>
.early-warning {
  position: absolute;
  right: vw(10);
  bottom: vw(10);
  width: vw(560);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  .warning-tit {
    width: 100%;
    height: vw(24);
    border-bottom: 1px solid rgba(153, 204, 255, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: vw(10);
    font-family: MicrosoftYaHei;
    font-weight: bold;
    color: #fff;
    position: relative;
    .warning-tenet-btn {
      width: vw(46);
      height: vw(16);
      border: 1px solid #ffff50;
      border-radius: 2px;
      color: #ffff50;
      text-align: center;
      line-height: vw(14);
      position: absolute;
      right: vw(10);
      cursor: pointer;
    }
  }
  .warning-body {
    width: 100%;
    height: vw(104);
    color: #fff;
    font-size: vw(10);
    .warning-box {
      width: 100%;
      height: vw(52);
      display: flex;
      padding: vw(9) vw(10);
      &:first-of-type {
        border-bottom: 1px solid rgba(153, 204, 255, 0.25);
      }
      .warning-lable {
        line-height: vw(34);
        text-align: center;
        padding-right: vw(10);
        border-right: 1px solid rgba(153, 204, 255, 0.25);
        margin-right: vw(10);
      }
      .warning-content {
        width: 1px;
        flex: 1;
        height: 100%;
        overflow: hidden;
        .warning-item {
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: vw(5);
          &:last-of-type {
            margin: 0;
          }
          .item-lable {
            width: vw(40);
            height: vw(14);
            background: rgba(255, 108, 0, 1);
            border-radius: 2px;
            font-size: vw(8);
            color: #fff;
            text-align: center;
            line-height: vw(14);
            margin-right: vw(10);
          }
          .item-des {
            line-height: 1;
          }
        }
      }
    }
  }

  .warning-tenet {
    position: absolute;
    left: -1px;
    bottom: vw(135);
    width: vw(272);
    height: vw(156);
    background: rgba(11, 28, 61, 0.7);
    border: 1px solid rgba(153, 204, 255, 0.25);
    padding: vw(7) vw(6);
    .tenet-tit {
      text-align: center;
      font-size: vw(9);
      color: #ffff50;
    }
    table {
      margin-top: vw(8);
      margin-bottom: vw(6);
      width: 100%;
      font-size: vw(8);
      color: #fff;
      border-top: 1px solid #607391;
      border-left: 1px solid #607391;
      td {
        border-right: 1px solid #607391;
        border-bottom: 1px solid #607391;
        text-align: center;
        line-height: vw(16);
      }
      .color-lump {
        width: vw(32);
        // height: vw(12);
        border-radius: 2px;
        text-align: center;
        line-height: vw(12);
        display: inline-block;
      }
    }
    .tenet-legend {
      display: flex;
      align-items: center;
      font-size: vw(8);
      color: #fff;
      margin-bottom: vw(4);
      &:last-of-type {
        margin: 0;
      }
      .legend-icon {
        width: vw(16);
        height: vw(10);
        border-radius: 1px;
        margin-right: vw(10);
      }
    }
  }

  .warning-details {
    position: absolute;
    left: vw(277);
    bottom: vw(135);
    width: vw(136);
    background: rgba(11, 28, 61, 0.7);
    border: 1px solid rgba(153, 204, 255, 0.25);
    padding: vw(8);
    font-size: vw(8);
    color: #fff;
    .type-date {
      display: flex;
      align-items: center;
      .type {
        width: vw(40);
        height: vw(14);
        background: rgba(255, 108, 0, 1);
        border-radius: 2px;
        font-size: vw(8);
        color: #fff;
        text-align: center;
        line-height: vw(14);
        margin-right: vw(10);
      }
    }
    p:last-of-type {
      margin-bottom: 0;
    }
  }

  .upper-limit {
    background: #fe4a5d;
  }

  .lower-limit {
    background: #ff6d10;
  }

  .relieve-limit {
    background: #8094dd;
  }
}
</style>
