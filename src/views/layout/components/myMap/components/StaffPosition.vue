<template>
  <div class="station-info">
    <div class="info-close iconfont icon-guanbi" @click="close"></div>
    <div class="info-tit">人员位置信息</div>

    <ul class="tab">
      <li>
        <div class="label">姓&emsp;&emsp;名:</div>
        <div class="value">{{params.realName}}</div>
      </li>
      <li>
        <div class="label">组&emsp;&emsp;织:</div>
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
        <div class="label">地&emsp;&emsp;址:</div>
        <div class="value">{{Addr}}</div>
      </li>
      <!-- <li>
        <div class="label text-spacing3">经&nbsp;纬&nbsp;度:</div>
        <div class="value">{{params.gpsLongitude}}，{{params.gpsLatitude}}</div>
      </li>-->
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'

@Component({})
export default class StaffPosition extends Vue {
  @Prop()
  public params!: any

  // 地址解析器
  public geocoder: any = null

  // 人员地址
  public Addr: string = ''

  public mounted() {
    this.geocoder = new AMap.Geocoder({
      batch: false,
      radius: 500
    })
    this.getPosition()
  }

  @Watch('params')
  public onChangedParams(val: any, oldVal: any) {
    this.getPosition()
  }

  // 关闭弹窗 清除数据
  @Emit('close')
  public close() {
    //
  }

  // 获取位置
  public getPosition(): void {
    this.geocoder.getAddress(
      [this.params.gpsLongitude, this.params.gpsLatitude],
      (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress
          this.Addr = address
        } else {
          this.Addr = '--'
        }
      }
    )
  }
}
</script>


<style lang="scss" scoped>
.station-info {
  position: absolute;
  @include vw2(top, 74);
  @include vw2(left, 533);
  @include vw2(width, 214);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  padding: vw(10) vw(6);
  padding-top: 0;
  box-sizing: border-box;
  .info-close {
    position: absolute;
    @include vw2(right, 10);
    @include vw2(top, 10);
    @include vw2(width, 9);
    @include vw2(height, 9);
    text-align: center;
    @include vw2(line-height, 9);
    @include vw2(font-size, 10);
    cursor: pointer;
    color: #fff;
  }
  .info-tit {
    color: #fff;
    @include vw2(font-size, 10);
    text-align: center;
    @include vw2(padding-top, 10);
    @include vw2(padding-bottom, 10);
    box-sizing: border-box;
  }
  .tab {
    width: 100%;
    border: 1px solid rgba(32, 85, 164, 1);
    padding: 0;
    margin: 0;
    @include vw2(font-size, 8);
    color: #bbb;
    li {
      margin: 0;
      list-style: none;
      @include vw2(padding, 6);
      box-sizing: border-box;
      border-bottom: 1px solid rgba(32, 85, 164, 1);
      display: flex;
      .label {
        @include vw2(width, 70);
        @include vw2(letter-spacing, 3.8);
        color: #fff;
        &.text-spacing3 {
          @include vw2(letter-spacing, 4);
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
