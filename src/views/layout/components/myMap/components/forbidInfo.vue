<template>
  <div class="forbid-info">
    <div class="info-close iconfont icon-guanbi" @click="close"></div>
    <div class="info-tit">
      <img src="@img/icon_forbid@3x.png">
      <span>禁停区名称：{{params.regionName}}</span>
    </div>

    <div class="bick-num">区域内车辆数：{{params.bicycleNum}}</div>

    <div class="bick-company-num">
      <div class="company-num" v-for="item in companyBikeList" :key="item.companyCode">
        <img :src="item.imgSrc">
        <span>{{item.companyName}}：{{item.companyBikeNum}}</span>
      </div>
    </div>

    <div class="tab" v-show="clearData.length">
      <div class="tab-head details-item">
        <div class="td1">派单时间</div>
        <div class="td2">推送企业</div>
        <div class="td3">处理状态</div>
        <div class="td4">清运数</div>
      </div>
      <div class="tab-body">
        <transition-group name="list-complete" tag="div">
          <div v-for="item in clearData" :key="item.key" class="details-item">
            <div class="td1">{{item.dispatchTime}}</div>
            <div class="td2">{{item.dispatchReceive}}</div>
            <div class="td3">{{item.state}}</div>
            <div class="td4">{{item.cleanNum}}</div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import moment, { now } from 'moment';

@Component({})
export default class ForbidInfo extends Vue {
  @Prop()
  public params!: any;

  // 定时器标志
  public clearTime: any = null;

  // 企业单车数据
  public companyBikeList: any[] = [];

  // 清理数据列表
  public clearData: any[] = [];

  // 关闭弹窗 清除数据
  @Emit('close')
  public close(): void {
    //
  }

  @Watch('params')
  public onchanged(val: any, oldVal: any) {
    this.formatData();
  }

  public beforeDestroy() {
    clearTimeout(this.clearTime);
  }

  public created() {
    this.formatData();
  }

  // 格式化数据
  public formatData(): void {
    clearTimeout(this.clearTime);
    this.companyBikeList = this.params.companyBikeList.map((item: any) => {
      item.imgSrc = require(`@img/${item.companyCode}@3x.png`);
      // item.imgSrc = `~@img/${item.companyCode}@3x.png`;
      return item;
    });

    if (this.params.dispatchList) {
      this.clearData = this.params.dispatchList.map((item: any) => {
        item.key = Math.random();
        item.state = item.sheetStatus === 2 ? '已处理' : '处理中';
        return item;
      });

      this.clearData.length > 3 && this.Animation();
    } else {
      this.clearData = [];
    }
  }

  // 动画
  public Animation(): void {
    let first: any;
    const data: any = this.clearData;

    const animation = (): void => {
      if (this.clearTime) {
        clearTimeout(this.clearTime);
      }

      this.clearTime = setTimeout((): void => {
        first = data.shift();
        first.key = now();
        data.push(first);
        animation();
      }, 2600);
    };

    animation();
  }
}
</script>


<style lang="scss" scoped>
.forbid-info {
  position: absolute;
  @include vw2(top, 150);
  @include vw2(left, 304);
  @include vw2(width, 260);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  @include vw2(padding, 10);
  @include vw2(padding-top, 0);
  box-sizing: border-box;
  color: #fff;
  .info-close {
    cursor: pointer;
    color: #fff;
    position: absolute;
    z-index: 10;
    @include vw2(right, 10);
    @include vw2(top, 10);
    @include vw2(width, 9);
    @include vw2(height, 9);
    text-align: center;
    @include vw2(line-height, 9);
    @include vw2(font-size, 10);
  }
  .info-tit {
    display: flex;
    justify-content: center;
    align-items: center;
    @include vw2(font-size, 10);
    @include vw2(padding-top, 10);
    @include vw2(padding-bottom, 10);
    box-sizing: border-box;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(23, 62, 130, 1) 1%,
        rgba(29, 217, 244, 1) 45%,
        rgba(23, 63, 131, 1) 100%
      );
      border-radius: 50%;
    }
    img {
      @include vw2(width, 10);
      @include vw2(height, 10);
      @include vw2(margin-right, 4);
    }
  }
  .bick-num {
    text-align: center;
    @include vw2(font-size, 9);
    line-height: 4em;
  }
  .bick-company-num {
    width: 100%;
    display: flex;
    @include vw2(font-size, 9);
    line-height: 2.5em;
    flex-wrap: wrap;
    .company-num {
      display: flex;
      @include vw2(padding-left, 19);
      align-items: center;
      width: 50%;
      img {
        @include vw2(width, 18);
        @include vw2(height, 18);
        @include vw2(margin-right, 10);
      }
    }
  }
  .tab {
    @include vw2(margin-top, 10);
    width: 100%;
    border: 1px solid rgba(32, 85, 164, 1);
    // border-bottom: none;
    @include vw2(font-size, 8);
    text-align: center;
    .details-item {
      display: flex;
      width: 100%;
      backface-visibility: hidden;
      transition: all 1.3s;
      z-index: 1;
      @include vw2(height, 16);
      @include vw2(line-height, 16);
      > div {
        border-right: 1px solid rgba(32, 85, 164, 1);
        border-bottom: 1px solid rgba(32, 85, 164, 1);
        &:last-of-type {
          border-right: none;
        }
      }
    }
    .td1 {
      width: 40%;
    }
    .td2 {
      width: 20%;
    }
    .td3 {
      width: 20%;
    }
    .td4 {
      width: 20%;
    }
    .tab-head {
      width: 100%;
      background: rgba(153, 204, 255, 0.2);
      color: #00cafa;
    }
    .tab-body {
      width: 100%;
      @include vw2(height, 48);
      overflow: hidden;
      position: relative;
    }
  }
  .list-complete-enter,
  .list-complete-leave-to {
    opacity: 0;
  }

  .list-complete-enter {
    transform: translate3d(0, 100%, 0);
    position: absolute;
  }

  .list-complete-leave-active {
    position: absolute;
    transform: translate3d(0, -100%, 0);
  }
}
</style>
