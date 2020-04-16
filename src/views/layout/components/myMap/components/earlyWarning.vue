<template>
  <div class="early-warning">
    <div class="warning-tit">
      <span>预警播报</span>
      <div class="warning-tenet-btn"
           @click="isPrinciple = !isPrinciple">
        <span>预警原则</span>
      </div>
    </div>
    <div class="warning-body">
      <!-- <div class="warning-box warning-realTime">
        <div class="warning-lable">实时预警</div>
        <div class="warning-content">
          <transition-group name="list-complete"
                            tag="div">
            <div class="warning-item"
                 @click="selectWarning(item,0)"
                 @mouseleave="Animation(0),isDetails = false"
                 :key="item.index"
                 v-for="item in EarlyWarnData">
              <div class="item-lable"
                   v-state='item.waringType'>
              </div>
              <div class="item-des">{{item | waringInfo}}</div>
            </div>
          </transition-group>
        </div>
      </div>
      <div class="warning-box warning-history">
        <div class="warning-lable">历史预警</div>
        <div class="warning-content">
          <transition-group name="list-complete"
                            tag="div">
            <div class="warning-item"
                 @click="selectWarning(item,1)"
                 @mouseleave="Animation(1),isDetails = false"
                 :key="item.index"
                 v-for="item in ClearEarly">
              <div class="item-lable"
                   v-state='-1'></div>
              <div class="item-des">{{item | waringInfo(-1)}}</div>
            </div>
          </transition-group>
        </div>
      </div> -->
      
      <div class="warning-box warning-realTime">
        <div class="warning-lable">实时预警</div>
        <div class="warning-content">
          <transition-group name="list-complete"
                            tag="div">
            <div class="warning-item"
                 @click="selectWarning(item,1)"
                 @mouseleave="Animation(1),isDetails = false"
                 :key="item.index"
                 v-for="item in ClearEarly">
              <div class="item-lable"
                    v-state='item.waringType'></div>
              <div class="item-des">{{item | waringInfo(-1)}}</div>
            </div>
          </transition-group>
        </div>
      </div>
      <div class="warning-box warning-history">
        <div class="warning-lable">历史预警</div>
        <div class="warning-content">
          <transition-group name="list-complete"
                            tag="div">
            <div class="warning-item"
                 @click="selectWarning(item,0)"
                 @mouseleave="Animation(0),isDetails = false"
                 :key="item.index"
                 v-for="item in EarlyWarnData">
              <div class="item-lable"
                 v-state='-1' >
              </div>
              <div class="item-des">{{item | waringInfo}}</div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <div class="warning-tenet"
         v-show="isPrinciple">
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
          <td>高(高于100%)</td>
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
          <td>适中(60%-100%)</td>
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

    <div class="warning-details"
         v-show="isDetails">
      <div class="type-date">
        <div class="type"
             v-state='detailsData.state'>
        </div>
        <span>{{detailsData.time}}</span>
      </div>

      <p>{{detailsData.details1}}</p>
      <p>{{detailsData.details2}}</p>
      <p>{{detailsData.details3}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import API from '@/api/index.ts';
import moment, { now } from 'moment';
import { refinedCal } from '@/libs/util.ts';

moment.locale('zh-cn');

@Component({
  directives: {
    state(el, binding) {
      const value = binding.value;
      switch (value) {
        case 0:
          el.innerText = '下限预警';
          el.style.background = '#ff6d10';
          break;
        case 1:
          el.innerText = '上限预警';
          el.style.background = '#fe4a5d';
          break;
        case -1:
          el.innerText = '预警解除';
          el.style.background = '#8094dd';
          break;
      }
    },
  },
  filters: {
    // 格式预警消息
    waringInfo(data: any, type?: number): string {
      let str: string = '';
      if (type === undefined) {
        // if (data.waringType === 0) {
        //   // 下限
        //   str = `${data.waringTime} ${data.orgName}有车辆${
        //     data.bicycleNum
        //   }辆，活跃率为${data.activeRate}%，建议企业增加投放`;
        // } else {
        //   // 上限
        //   str = `${data.waringTime} ${data.orgName}有车辆${
        //     data.bicycleNum
        //   }辆，活跃率为${data.activeRate}%，已通知企业加强巡查和清运`;
        // }
        if (data.waringType === 0) {
          // 下限
          str = `${data.waringTime} ${data.orgName}有车辆${
            data.bicycleNum
          }辆，活跃率为${data.activeRate}%，下限预警已解除`;
        } else {
          // 上限
          str = `${data.waringTime} ${data.orgName}有车辆${
            data.bicycleNum
          }辆，活跃率为${data.activeRate}%，上限预警已解除`;
        }
      } else {
        // if (data.waringType === 0) {
        //   // 下限
        //   str = `${data.clearWaringTime} ${data.orgName}有车辆${
        //     data.clearWaringBicycleNum
        //   }辆，活跃率为${data.clearWaringActiveRate}%，下限预警已解除`;
        // } else {
        //   // 上限
        //   str = `${data.clearWaringTime} ${data.orgName}有车辆${
        //     data.clearWaringBicycleNum
        //   }辆，活跃率为${data.clearWaringActiveRate}%，上限预警已解除`;
        // }
        if (data.waringType === 0) {
          // 下限
          str = `${data.clearWaringTime} ${data.orgName}有车辆${
            data.clearWaringBicycleNum
          }辆，活跃率为${data.clearWaringActiveRate}%，建议企业增加投放`;
        } else {
          // 上限
          str = `${data.clearWaringTime} ${data.orgName}有车辆${
            data.clearWaringBicycleNum
          }辆，活跃率为${data.clearWaringActiveRate}%，已通知企业加强巡查和清运`;
        }
      }
      return str;
    },
  },
})
export default class EarlyWarning extends Vue {
  // 实时预警
  public EarlyWarnData: any[] = [];

  // 历史预警
  public ClearEarly: any[] = [];

  // 定时器
  public clearTime: any[] = [];

  // 是否显示预警原则
  public isPrinciple: boolean = false;

  // 详情数据
  public detailsData: any = {};

  // 是否显示详情数据
  public isDetails: boolean = false;

  public mounted() {
    this.getWaring();
  }

  public beforeDestroy() {
    clearTimeout(this.clearTime[0]);
    clearTimeout(this.clearTime[1]);
  }

  public getWaring(): void {
    const nowTime: string = moment().format('YYYY-MM-DD');
    API.getWaring({
      startTime: nowTime + ' 00:00:00',
      endTime: nowTime + ' 23:59:59',
    }).then(
      (res: any): void => {
        this.EarlyWarnData = res.orgEarlyWaringInfo.map((item: any) => {
          item.index = now() + Math.random();
          item.activeRate = refinedCal(`${item.activeRate}*100`, 2);
          item.activeRateThreshold = refinedCal(
            `${item.activeRateThreshold}*100`,
            2,
          );
          return item;
        });

        this.ClearEarly = res.orgClearEarlyInfo.map((item: any) => {
          item.index = now() + Math.random();
          item.activeRate = refinedCal(`${item.activeRate}*100`, 2);
          item.clearWaringActiveRate = refinedCal(
            `${item.clearWaringActiveRate}*100`,
            2,
          );
          item.activeRateThreshold = refinedCal(
            `${item.activeRateThreshold}*100`,
            2,
          );
          return item;
        });


        this.Animation(1);
        this.Animation(0);

      },
    );
  }

  // 选择预警查看详情 0实时预警 1历史预警
  public selectWarning(data: any, type: number) {
    clearTimeout(this.clearTime[type]);

    const bicycleNum: number =
      type === 0 ? data.bicycleNum : data.clearWaringBicycleNum;
    const activeRate: number =
      type === 0 ? data.activeRate : data.clearWaringActiveRate;

    let details2: string = '';
    let details3: string = '';

    if (type === 0) {
      if (data.waringType === 0) {
        details2 = `低于泊位阀值${data.parkNum}辆，并活跃率高于${
          data.activeRateThreshold
        }%`;
        // details3 = '建议企业增加投放';
        details3 = '下限预警已解除';
      } else {
        details2 = `高于泊位阀值${data.parkNum}辆，并活跃率低于${
          data.activeRateThreshold
        }%`;
        // details3 = '已通知企业加强巡查和清运';
        details3 = '上限预警已解除';
      }
    } else {
      const saturability: number = refinedCal(
        `${data.clearWaringBicycleNum}/${data.parkNum}*100`,
        2,
      );
      if (data.waringType === 0) {
        if (saturability <= 60 && data.clearWaringActiveRate < 25) {
          details2 = `低于下限预警泊位阀值60%，活跃率低于${
            data.activeRateThreshold
          }`;
          // details2 = `低于下限预警泊位阀值${saturability}%，活跃率低于${
          //   data.activeRateThreshold
          // }`;
        } else if (saturability >= 60) {
          details2 = `高于下限预警泊位阀值60%`;
          // details2 = `高于下限预警泊位阀值${saturability}%`;
        }
        // details3 = '下限预警已解除';
        details3 = '建议企业增加投放';
      } else {
        if (saturability >= 100 && data.clearWaringActiveRate > 45) {
          details2 = `高于上限预警泊位阀值100%，并活跃率高于${
            data.activeRateThreshold
          }%`;
          // details2 = `高于上限预警泊位阀值${saturability}%，并活跃率高于${
          //   data.activeRateThreshold
          // }%`;
        } else if (saturability >= 60 && saturability < 100) {
          details2 = `高于上限预警泊位阀值60%，并低于上限预警泊位阀值100%`;
          // details2 = `高于上限预警泊位阀值${saturability}%，并低于上限预警泊位阀值100%`;
        }
        // details3 = '上限预警已解除';
        details3 = '已通知企业加强巡查和清运';
      }
    }

    this.detailsData = {
      state: type === 0 ? data.waringType : -1,
      time: type === 0 ? data.waringTime : data.clearWaringTime,
      details1: `${data.orgName}有车辆${bicycleNum}辆，活跃率为${activeRate}%`,
      details2,
      details3,
    };

    this.isDetails = true;
  }

  // 动画 0实时预警 1历史预警
  public Animation(type: number): void {
    let first: any;
    const data: any = type === 0 ? this.EarlyWarnData : this.ClearEarly;

    if (data.length < 3) {
      return;
    }

    const animation = (): void => {
      if (this.clearTime[type]) {
        clearTimeout(this.clearTime[type]);
      }

      this.clearTime[type] = setTimeout((): void => {
        first = data.shift();
        first.index = now();
        data.push(first);
        animation();
      }, 2600);
    };

    animation();
  }
}
</script>


<style lang="scss" scoped>
.early-warning {
  position: absolute;
  @include vw2(right, 10);
  @include vw2(bottom, 10);
  @include vw2(width, 560);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  .warning-tit {
    width: 100%;
    @include vw2(height, 24);
    border-bottom: 1px solid rgba(153, 204, 255, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    @include vw2(font-size, 10);
    font-family: MicrosoftYaHei;
    font-weight: bold;
    color: #fff;
    position: relative;
    .warning-tenet-btn {
      @include vw2(width, 46);
      @include vw2(height, 16);
      border: 1px solid #ffff50;
      border-radius: 2px;
      color: #ffff50;
      text-align: center;
      @include vw2(line-height, 14);
      position: absolute;
      @include vw2(right, 10);
      cursor: pointer;
    }
  }
  .warning-body {
    width: 100%;
    @include vw2(height, 104);
    color: #fff;
    @include vw2(font-size, 10);
    .warning-box {
      width: 100%;
      @include vw2(height, 52);
      display: flex;
      padding: vw(9) vw(10);
      &:first-of-type {
        border-bottom: 1px solid rgba(153, 204, 255, 0.25);
      }
      .warning-lable {
        @include vw2(line-height, 34);
        text-align: center;
        @include vw2(padding-right, 10);
        border-right: 1px solid rgba(153, 204, 255, 0.25);
        @include vw2(margin-right, 10);
      }
      .warning-content {
        width: 1px;
        flex: 1;
        height: 100%;
        overflow: hidden;
        position: relative;
        .warning-item {
          backface-visibility: hidden;
          transition: all 1.3s;
          z-index: 1;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          @include vw2(margin-bottom, 5);
          &:last-of-type {
            margin: 0;
          }
          .item-lable {
            @include vw2(width, 40);
            @include vw2(height, 14);
            border-radius: 2px;
            @include vw2(font-size, 8);
            background: #ff6d10;
            color: #fff;
            text-align: center;
            @include vw2(line-height, 14);
            @include vw2(margin-right, 10);
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
    @include vw2(bottom, 135);
    @include vw2(width, 272);
    @include vw2(height, 156);
    background: rgba(11, 28, 61, 0.7);
    border: 1px solid rgba(153, 204, 255, 0.25);
    padding: vw(7) vw(6);
    .tenet-tit {
      text-align: center;
      @include vw2(font-size, 9);
      color: #ffff50;
    }
    table {
      @include vw2(margin-top, 8);
      @include vw2(margin-bottom, 6);
      width: 100%;
      @include vw2(font-size, 8);
      color: #fff;
      border-top: 1px solid #607391;
      border-left: 1px solid #607391;
      td {
        border-right: 1px solid #607391;
        border-bottom: 1px solid #607391;
        text-align: center;
        @include vw2(line-height, 16);
      }
      .color-lump {
        @include vw2(width, 32);
        // height: vw(12);
        border-radius: 2px;
        text-align: center;
        @include vw2(line-height, 12);
        display: inline-block;
      }
    }
    .tenet-legend {
      display: flex;
      align-items: center;
      @include vw2(font-size, 8);
      color: #fff;
      @include vw2(margin-bottom, 4);
      &:last-of-type {
        margin: 0;
      }
      .legend-icon {
        @include vw2(width, 16);
        @include vw2(height, 10);
        border-radius: 1px;
        @include vw2(margin-right, 10);
      }
    }
  }

  .warning-details {
    position: absolute;
    @include vw2(left, 277);
    @include vw2(bottom, 135);
    @include vw2(width, 136);
    background: rgba(11, 28, 61, 0.7);
    border: 1px solid rgba(153, 204, 255, 0.25);
    @include vw2(padding, 8);
    @include vw2(font-size, 8);
    color: #fff;
    .type-date {
      display: flex;
      align-items: center;
      .type {
        @include vw2(width, 40);
        @include vw2(height, 14);
        border-radius: 2px;
        @include vw2(font-size, 8);
        color: #fff;
        text-align: center;
        @include vw2(line-height, 14);
        @include vw2(margin-right, 10);
      }
    }
    p {
      margin: vw(6) 0;
      line-height: 1.4em;
      &:last-of-type {
        margin-bottom: 0;
      }
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
