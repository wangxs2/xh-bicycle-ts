<template>
  <div class="rank-block">
    <div class="block-tit">{{blockTit}}</div>

    <div class="block-centent">
      <transition-group name="custom-classes-transition"
                        tag="div"
                        enter-active-class="bounce-my-enter"
                        leave-active-class="bounce-my-leave">
        <div class="rank-item"
             v-for="item in ranking"
             :key="item.index">
          <div class="rank-info"
               :style="{color: fontColor}">
            <div class="rank-index">NO.{{item.index}} <span class="rank-name">{{item.name}}</span></div>
            <div>{{item.describe}}</div>
          </div>
          <div class="rank-bar">
            <div class="rank-barIn"
                 :style="{width: item.percentage,background: `linear-gradient(90deg, ${gradientRamp[0]} 0%, ${gradientRamp[1]} 100%)`}"></div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { arrGroup } from "@/libs/util.ts";
import { Component, Watch, Prop, Vue } from "vue-property-decorator";

interface PropData {
  percentage: string;
  index: number;
  name: string;
  describe: string;
  [propName: string]: any;
}

@Component
export default class RankBlock extends Vue {
  @Prop()
  private rankData!: Array<PropData>; // 原始数据

  @Prop()
  private fontColor!: string; // 颜色

  @Prop()
  private blockTit!: string; // 标题

  @Prop()
  private gradientRamp!: Array<string>; // 渐变色

  // 分组数据
  private groupData: Array<any> = [];

  // 当前数据
  private ranking: Array<any> = [];

  private TimeNum: number | null = null;
  private TimeSubNum: number | null = null;

  @Watch("rankData")
  onchanged(val: Array<any>, oldVal: Array<any>) {
    if (val.length) {
      if (this.TimeNum) {
        clearTimeout(this.TimeNum);
        this.TimeNum = null;
      }

      if (this.TimeSubNum) {
        clearTimeout(this.TimeSubNum);
        this.TimeSubNum = null;
      }

      this.groupData = arrGroup(this.rankData, 5);
      this.rankAnimation(0);
    }
  }

  // 排行的动画
  rankAnimation(index: number) {
    if (this.TimeNum) {
      clearTimeout(this.TimeNum);
      this.TimeNum = null;
    }

    // 每组中的数据切换
    let animationItem = (id: number) => {
      if (this.TimeSubNum) {
        clearTimeout(this.TimeSubNum);
        this.TimeSubNum = null;
      }

      this.$set(this.ranking, id, this.groupData[index][id]);

      this.TimeSubNum = setTimeout(() => {
        id < this.groupData[index].length - 1 ? animationItem(++id) : null;
      }, 1200);
    };

    animationItem(0);

    // 每组切换
    this.TimeNum = setTimeout(() => {
      index = index < this.groupData.length - 1 ? index + 1 : 0;
      this.rankAnimation(index);
    }, 10000);
  }
}
</script>

<style lang="scss" scoped>
.rank-block {
  width: 100%;
  height: 100%;
  padding: vh(10) vw(10);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .block-tit {
    font-size: vh(9);
    color: #f4f4f4;
    font-weight: 600;
  }
  .block-centent {
    flex: 1;
    width: 100%;
    height: 1px;
    position: relative;
    .rank-item {
      width: 100%;
      margin-top: vh(8);
      .rank-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: vw(8);
        line-height: 1;
        .rank-index {
          flex: 1;
          width: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .rank-name {
            color: #fff;
          }
        }
      }
      .rank-bar {
        margin-top: vh(3);
        width: 100%;
        height: vh(5);
        box-sizing: border-box;
        position: relative;
        border-radius: vh(2.5);
        background: #292c3e;
        overflow: hidden;
        .rank-barIn {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: vh(2.5);
        }
      }
    }
  }

  .bounce-my-enter {
    backface-visibility: visible;
    animation: myflip 1s;
  }
  @keyframes myflip {
    from {
      transform: rotate3d(1, 0, 0, 360deg);
      -webkit-animation-timing-function: ease-out;
      animation-timing-function: ease-out;
    }
    40% {
      transform: rotate3d(1, 0, 0, 190deg);
      -webkit-animation-timing-function: ease-out;
      animation-timing-function: ease-out;
    }
    50% {
      transform: rotate3d(1, 0, 0, 170deg);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    80% {
      transform: rotate3d(1, 0, 0, 0deg);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
    to {
      transform: rotate3d(1, 0, 0, 0deg);
      -webkit-animation-timing-function: ease-in;
      animation-timing-function: ease-in;
    }
  }
  .list-complete-enter,
  .list-complete-leave-to {
    opacity: 0;
  }
  .list-complete-leave-active {
    position: absolute;
    opacity: 0;
  }
  .bounce-my-leave {
    position: absolute;
  }
}
</style>
