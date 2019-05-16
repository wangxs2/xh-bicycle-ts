import { Component, Prop, Vue } from 'vue-property-decorator';
import Echart from './myEcharts';
import API from '@/api/index.ts';
import { arrGroup } from '@/libs/util.ts';

let MyEchart: any = null; // 自定义echarts
@Component
export default class OrderSituation extends Vue {
  // 工单数据分组
  private workOrder: any[] = [];
  // 当前显示的工单数据
  private WorkOrderItem: any[] = [];
  // 全部的echarts对象
  private echartNodes: any[] = [];
  // 工单数据定时器
  private orderTimeOutNode: any = null;
  // 工单当前的位置
  private orderIndex: number = 0;

  public created() {
    this.getWorkOrder();
  }

  public mounted() {
    MyEchart = new Echart();
  }

  // 获取工单数据
  private getWorkOrder(): void {
    API.getWorkOrder().then(
      (res: any): void => {
        this.dispatchOrder(res);
      },
    );
  }

  // 处理数据
  private dispatchOrder(data: any): void {
    // 年月日 保留月日
    const timeArr: string[] = data.timeArea.map(
      (item: any): void => {
        return item.slice(5);
      },
    );
    // 企业配色
    const enterpriseColor = {
      1006: ['#F25B4A', '#FF4513'], // 摩拜
      1007: ['#F4BE13', '#FF8A00'], // ofo
      1014: ['#fe4f0b', '#fb2d3d'], // 赳赳
      1015: ['#00A1E9', '#4F68F8'], // 哈啰
      1059: ['#02c70f', '#7cca00'], // 享骑
    };

    // 容器的id
    let elIndex: number = 0;

    // 处理数据
    const WorkOrder: any[] = data.data.map(
      (item: any): any => {
        elIndex = elIndex < 3 ? ++elIndex : 1;

        return {
          el: `echartContainer${elIndex}`,
          x: timeArr,
          bar: item.dispatch,
          line: item.selfCheck,
          name: item.orgName,
          color: (enterpriseColor as any)[item.orgId],
        };
      },
    );

    this.workOrder = arrGroup(WorkOrder, 3);
    this.orderSlideShow(0);
  }

  // 工单数据的动画
  private orderSlideShow(index: number): void {
    // 清除定时器
    if (this.orderTimeOutNode) {
      clearTimeout(this.orderTimeOutNode);
      this.orderTimeOutNode = null;
    }

    const WorkOrder: any[] = this.workOrder;

    for (let i: number = 0; i < 3; i++) {
      if (WorkOrder[index][i]) {
        MyEchart.echartsOption(WorkOrder[index][i]);
      } else {
        MyEchart.clearContainer(`echartContainer${i + 1}`);
      }
    }

    // 如果只有一组就不用切换了
    if (WorkOrder.length < 2) { return; }

    this.orderTimeOutNode = setTimeout(() => {
      this.orderIndex = index < WorkOrder.length - 1 ? index + 1 : 0;
      this.orderSlideShow(this.orderIndex);
    }, 6000);
  }
}
