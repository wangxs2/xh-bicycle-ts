<template>
  <div class="station-info">
    <div class="info-close iconfont icon-guanbi"
         @click="close">
    </div>
    <div class="info-tit">点位信息</div>

    <ul class="tab">
      <li>
        <div class="label">终端编号:</div>
        <div class="value">{{params.terminalId}}</div>
      </li>
      <li>
        <div class="label">地&emsp;&emsp;址:</div>
        <div class="value">{{params.address}}</div>
      </li>
      <li>
        <div class="label">设备类型:</div>
        <div class="value">{{params.type | formatType}}</div>
      </li>
      <li>
        <div class="label">设备状态:</div>
        <div class="value">{{params.onLineStatus}}</div>
      </li>
      <li v-if="params.type === 0">
        <div class="label">是否浸水:</div>
        <div class="value">{{params.bWater | waterType}}</div>
      </li>
      <li v-if="params.type === 1">
        <div class="label">系统电压:</div>
        <div class="value">{{params.sysVoltage}}</div>
      </li>
      <li v-if="params.type === 1">
        <div class="label">电池电流:</div>
        <div class="value">{{params.batteryCurrent}}</div>
      </li>
      <li>
        <div class="label">电池电压:</div>
        <div class="value">{{params.batteryVoltage}}</div>
      </li>
      <li v-if="params.type === 1">
        <div class="label text-spacing">太阳能电压:</div>
        <div class="value">{{params.powerVoltage}}</div>
      </li>
      <li>
        <div class="label">所属区域:</div>
        <div class="value">{{params.orgName}}</div>
      </li>
      <li>
        <div class="label">心跳时间:</div>
        <div class="value">{{params.uploadTime}}</div>
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component({
  filters: {
    formatType(value: number): string {
      let type: string = "--";
      if (value === 0) {
        type = "地埋式蓝牙嗅探设备";
      } else if (value === 1) {
        type = "抱杆式蓝牙嗅探设备";
      }
      return type;
    },
    waterType(value: number): string {
      let type: string = "--";
      if (value === 0) {
        type = "否";
      } else if (value === 1) {
        type = "是";
      }
      return type;
    }
  }
})
export default class Stationinfo extends Vue {
  @Prop()
  public params!: any;

  // 关闭弹窗 清除数据
  @Emit("close")
  close(): void {}
}
</script>


<style lang="scss" scoped>
.station-info {
  position: absolute;
  top: vh(74);
  left: vw(533);
  width: vw(214);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  padding: vw(10) vw(6);
  padding-top: 0;
  box-sizing: border-box;
  .info-close {
    position: absolute;
    right: vw(10);
    top: vw(10);
    width: vw(9);
    height: vw(9);
    text-align: center;
    line-height: vw(9);
    font-size: vw(10);
    cursor: pointer;
    color: #fff;
  }
  .info-tit {
    color: #fff;
    font-size: vw(10);
    text-align: center;
    padding: vw(10) 0;
    box-sizing: border-box;
  }
  .tab {
    width: 100%;
    border: 1px solid rgba(32, 85, 164, 1);
    padding: 0;
    margin: 0;
    font-size: vw(8);
    color: #bbb;
    li {
      margin: 0;
      list-style: none;
      padding: vw(6);
      box-sizing: border-box;
      border-bottom: 1px solid rgba(32, 85, 164, 1);
      display: flex;
      .label {
        width: vw(70);
        letter-spacing: vw(3.4);
        color: #fff;
        &.text-spacing {
          letter-spacing: vw(1.1);
        }
      }
      .value {
        width: 1px;
        flex: 1;
      }
      &:last-of-type {
        border: none;
      }
    }
  }
}
</style>
