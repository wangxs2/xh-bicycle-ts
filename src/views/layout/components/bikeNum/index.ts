import { Component, Vue } from 'vue-property-decorator';
import { toThousands } from '@/libs/util.ts';
import API from '@/api/index.ts';
import numRoll from './numRoll.vue';

@Component({
  components: {
    numRoll,
  },
})
export default class BikeNum extends Vue {
  // @Prop() private msg!: string;
  public putInSelectFlag: boolean = false; // 打开投放量的选择框
  public weekActiveSelectFlag: boolean = false; // 打开周活跃量的选择框

  public putInNumDate: Array<{}> = [{}]; // 投放量数据
  public weekActiveNumDate: Array<{}> = [{}]; // 周活跃量数据

  public putInSelect: number = 0; // 投放选择
  public weekActiveSelect: number = 0; // 周活跃量选择

  public created() {
    this.getOrgBike();
  }

  // 获取投放量 和活跃量
  public getOrgBike(): void {
    API.getOrgBike().then((res: any) => {
      const orgCompanyNum: Array<{}> = [
        {
          bicycleNum: res.orgNum ? res.orgNum : '0',
          companyName: '全部',
        },
        ...res.orgCompanyNum,
      ];
      const orgCompanyActiveNum: Array<{}> = [
        {
          activeNum: res.orgActiveNum ? res.orgActiveNum : '0',
          companyName: '全部',
        },
        ...res.orgCompanyActiveNum,
      ];

      this.putInNumDate = orgCompanyNum.map(
        (item: any): object => {
          item.bicycleNum = toThousands(item.bicycleNum);
          return item;
        },
      );

      this.weekActiveNumDate = orgCompanyActiveNum.map(
        (item: any): object => {
          item.activeNum = toThousands(item.activeNum);
          return item;
        },
      );
    });
  }

  // 鼠标事件 打开选择组织框 type: 1 投放量 2 周活跃
  public moveEventSelectOrg(type: number): void {
    if (type === 1) {
      this.putInSelectFlag = true;
    } else {
      this.weekActiveSelectFlag = true;
    }
  }

  // 鼠标事件 关闭组织框 type: 1 投放量 2 周活跃
  public leaveEventSelectOrg(type: number): void {
    if (type === 1) {
      this.putInSelectFlag = false;
    } else {
      this.weekActiveSelectFlag = false;
    }
  }
}
