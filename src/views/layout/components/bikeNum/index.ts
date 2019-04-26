import { Component, Vue } from 'vue-property-decorator'
import { toThousands } from '@/libs/util.ts'
import API from '@/api/index.ts'

@Component({
  components: {}
})
export default class BikeNum extends Vue {
  // @Prop() private msg!: string;
  putInSelectFlag: boolean = false // 打开投放量的选择框
  weekActiveSelectFlag: boolean = false // 打开周活跃量的选择框

  putInNumDate: Array<{}> = [{}] // 投放量数据
  weekActiveNumDate: Array<{}> = [{}] // 周活跃量数据

  putInSelect: number = 0 // 投放选择
  weekActiveSelect: number = 0 // 周活跃量选择

  created() {
    this.getOrgBike()
  }

  // 获取投放量 和活跃量
  getOrgBike(): void {
    API.getOrgBike().then((res: any) => {
      let orgCompanyNum: Array<{}> = [
        {
          bicycleNum: res.orgNum ? res.orgNum : '0',
          companyName: '全部'
        },
        ...res.orgCompanyNum
      ]
      let orgCompanyActiveNum: Array<{}> = [
        {
          activeNum: res.orgActiveNum ? res.orgActiveNum : '0',
          companyName: '全部'
        },
        ...res.orgCompanyActiveNum
      ]

      this.putInNumDate = orgCompanyNum.map(
        (item: any): object => {
          item.bicycleNum = toThousands(item.bicycleNum)
          return item
        }
      )

      this.weekActiveNumDate = orgCompanyActiveNum.map(
        (item: any): object => {
          item.activeNum = toThousands(item.activeNum)
          return item
        }
      )
    })
  }

  // 鼠标事件 打开选择组织框 type: 1 投放量 2 周活跃
  moveEventSelectOrg(type: number): void {
    if (type == 1) {
      this.putInSelectFlag = true
    } else {
      this.weekActiveSelectFlag = true
    }
  }

  // 鼠标事件 关闭组织框 type: 1 投放量 2 周活跃
  leaveEventSelectOrg(type: number): void {
    if (type == 1) {
      this.putInSelectFlag = false
    } else {
      this.weekActiveSelectFlag = false
    }
  }
}
