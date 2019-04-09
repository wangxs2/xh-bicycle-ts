import API from '@/api/index.ts'
import moment from 'moment'

moment.locale('zh-cn')

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class WorkDetails extends Vue {
  private workOrderData: Array<{}> = []

  private clearTime: number | null = null

  created() {
    this.getWorkOrder()
  }

  getWorkOrder(): void {
    // 昨天
    const startTime: string = moment()
      .subtract(14, 'days')
      .format('YYYY-MM-DD')

    const endTime: string = moment().format('YYYY-MM-DD')
    API.getWorkOrderDetails(startTime, endTime).then(
      (res: any): void => {
        // 时间倒序
        const sortData: Array<{}> = res.sort((x: any, y: any) => {
          if (x.dispatchTime > y.dispatchTime) {
            return -1
          } else if (x.dispatchTime < y.dispatchTime) {
            return 1
          } else {
            return 0
          }
        })

        // 取十条
        let data: Array<{}> = sortData.slice(0, 10)

        data = data.map(
          (item: any, index: number): object => {
            return {
              index,
              time: moment(item.dispatchTime).format('YYYY-MM-DD HH:mm'),
              dir: item.handleAddr,
              des: '共享单车乱停乱放',
              org: item.orgName,
              status: item.status == 2 ? '已处理' : '处理中'
            }
          }
        )

        data.length ? this.complaintAnimation(data) : null
      }
    )
  }

  // 投诉工单的动画
  complaintAnimation(oldData: Array<{}>): void {
    let first: any
    let dataLength: number = oldData.length

    let animation = (data: any): void => {
      if (this.clearTime) {
        clearTimeout(this.clearTime)
        this.clearTime = null
      }

      this.workOrderData = data
      this.clearTime = setTimeout((): void => {
        first = data.shift()
        first.index = dataLength++
        data.push(first)
        animation(data)
      }, 2000)
    }

    animation(oldData)
  }
}
