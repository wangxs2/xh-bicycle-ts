<template>
  <div class="datetime">
    <div class="time-date">
      <div>{{timeDate.date}}</div>
      <div style="color:#40CBFF;">{{timeDate.week}}</div>
    </div>
    <div class="time">{{timeDate.time}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';
moment.locale('zh-cn');

@Component
export default class DateTime extends Vue {
  public timeDate: object = {};
  public clearTime: any = null;

  public created() {
    this.setTime();
  }

  public setTime(): void {
    if (this.clearTime) {
      clearTimeout(this.clearTime);
    }
    const nowDate = moment();
    const date = nowDate.format('MM-DD HH:mm:ss').split(' ');
    const week = nowDate.format('dddd');

    this.timeDate = {
      time: date[1],
      date: date[0],
      week,
    };

    this.clearTime = setTimeout(() => {
      this.setTime();
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.datetime {
  width: vw(125);
  height: vh(48);
  padding: vh(9) vw(14);
  box-sizing: border-box;
  background: url("~@img/bg_border_2@2x.png") no-repeat center;
  background-size: 100% 100%;
  color: #ffffff;
  font-size: vw(20);
  text-align: center;
  .time-date {
    font-size: vw(10);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: vh(2);
  }
  .time {
    line-height: vh(22);
  }
}
</style>
