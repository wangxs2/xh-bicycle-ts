import { Component, Prop, Vue } from 'vue-property-decorator'
import Echart from './myEcharts'
import API from '@/api/index.ts'
import { arrGroup, refinedCal } from '@/libs/util.ts'

let MyEchart: any = null // 自定义echarts
@Component
export default class workDispose extends Vue {
  // 处置率数据
  private roughHandling: Array<any> = []
  // 当前显示的处置率数据
  private roughHandlingItem: Array<any> = []
  // 工单数据定时器
  private orderTimeOutNode: any = null
  // 工单当前的位置
  private orderIndex: number = 0

  created() {
    this.getWorkOrder()
  }

  mounted() {
    MyEchart = new Echart()
  }

  // 获取工单处理数据
  private getWorkOrder(): void {
    API.getRoughHandling().then(
      (res: any): void => {
        this.dispatchOrder(res)
      }
    )
  }

  // 处理数据
  private dispatchOrder(data: any): void {
    // 企业配色
    const enterpriseColor = {
      '1006': ['#F25B4A', '#4F505D'], // 摩拜
      '1007': ['#FBC303', '#4F505D'], // ofo
      '1014': ['#FB2D3D', '#4F505D'], // 赳赳
      '1015': ['#01A1FF', '#4F505D'], // 哈啰
      '1059': ['#7CCA00', '#4F505D'] // 享骑
    }

    // 容器的id
    let elIndex: number = 0

    let proportion: number | string = 0
    // 处理数据
    let WorkOrder: Array<any> = data.map(
      (item: any): any => {
        elIndex = elIndex < 3 ? ++elIndex : 1
        proportion =
          item.dispatch === 0
            ? 0
            : refinedCal(`${item.dispatch}/${item.dispatched}*100`, 2)

        return {
          el: `disContainer${elIndex}`,
          value: proportion,
          name: item.orgName,
          unVal: refinedCal(`100-${proportion}`, -1),
          color: (enterpriseColor as any)[item.orgId]
        }
      }
    )

    this.roughHandling = arrGroup(WorkOrder, 3)

    this.orderSlideShow(this.orderIndex)
  }

  // 工单数据的动画
  private orderSlideShow(index: number): void {
    // 清除定时器
    if (this.orderTimeOutNode) {
      clearTimeout(this.orderTimeOutNode)
      this.orderTimeOutNode = null
    }

    let WorkOrder: Array<any> = this.roughHandling

    this.roughHandlingItem = WorkOrder[index]

    for (let i: number = 0; i < 3; i++) {
      if (WorkOrder[index][i]) {
        MyEchart.echartsOption(WorkOrder[index][i])
      } else {
        MyEchart.clearContainer(`disContainer1${i + 1}`)
      }
    }

    // 如果只有一组就不用切换了
    if (WorkOrder.length < 2) return

    this.orderTimeOutNode = setTimeout(() => {
      this.orderIndex = index < WorkOrder.length - 1 ? index + 1 : 0
      this.orderSlideShow(this.orderIndex)
    }, 6000)
  }
}
