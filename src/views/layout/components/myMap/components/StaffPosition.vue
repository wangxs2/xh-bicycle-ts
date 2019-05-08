<template>
  <div class="station-info">
    <div class="info-close iconfont icon-guanbi"
         @click="close">
    </div>
    <div class="info-tit">人员位置信息</div>

    <ul class="tab">
      <li>
        <div class="label">姓&emsp;&emsp;名:</div>
        <div class="value">{{params.personName}}</div>
      </li>
      <li>
        <div class="label">企&emsp;&emsp;业:</div>
        <div class="value">{{params.companyName}}</div>
      </li>
      <li>
        <div class="label">用户类型:</div>
        <div class="value">{{params.userType}}</div>
      </li>
      <li>
        <div class="label text-spacing5">位置上报时间:</div>
        <div class="value">{{params.reportTime}}</div>
      </li>
      <li>
        <div class="label text-spacing3">经&nbsp;纬&nbsp;度:</div>
        <div class="value">{{params.gpsLongitude}}，{{params.gpsLatitude}}</div>
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component({})
export default class StaffPosition extends Vue {
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
        letter-spacing: vw(3.8);
        color: #fff;
        &.text-spacing3 {
          letter-spacing: vw(4);
        }
        &.text-spacing5 {
          letter-spacing: 0;
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
