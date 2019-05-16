<template>
  <div class="bleCheck-table">
    <div class="close iconfont icon-guanbi" @click="close"></div>
    <div class="bleCheck-head">列表详情 -- {{params.address}}</div>
    <div class="bleCheck-body">
      <div class="screens">
        <el-select v-model="company" @change="getBikeDetailInfo" size="mini" placeholder="请选择">
          <el-option
            v-for="item in companyData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="table">
        <div class="table-head">
          <table>
            <tr>
              <th class="td1">#</th>
              <th class="td2">mac地址</th>
              <th class="td3">信号强度</th>
              <th class="td4">蓝牙名称</th>
              <th class="td5">上传时间</th>
            </tr>
          </table>
        </div>
        <div class="table-body">
          <el-scrollbar>
            <table cellpadding="0" cellspacing="0">
              <tr v-for="(item,index) in tableData" :key="item.bikeMac">
                <td class="td1">{{(currentPage - 1) * pageSize + index + 1}}</td>
                <td class="td2">{{item.bikeMac}}</td>
                <td class="td3">{{item.rssi}}</td>
                <td class="td4">{{item.bikeTypeName}}</td>
                <td class="td5">{{item.uploadTime}}</td>
              </tr>
            </table>
          </el-scrollbar>
        </div>
      </div>
      <div class="paging">
        <el-pagination
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import API from '@/api/index.ts';

@Component({})
export default class BleCheckTable extends Vue {
  @Prop()
  public params!: any;

  // 选择企业
  private company: string = '';

  // 企业数据
  private companyData: any = [
    {
      label: '全部',
      value: '',
    },
    {
      label: '摩拜',
      value: '07mobike',
    },
    {
      label: 'ofo',
      value: '05ofo',
    },
    {
      label: '哈罗',
      value: '03hellobike',
    },
    {
      label: '赳赳',
      value: '0899bike',
    },
    {
      label: '享骑',
      value: '01xqcx',
    },
  ];

  // 表格数据
  private tableData: any = [];

  // 当前页数
  private currentPage: number = 1;

  // 数据量
  private total: number = 0;

  // 每页数据量
  private pageSize: number = 20;

  // 关闭弹窗 清除数据
  @Emit('close')
  public close() {
    //
  }

  public created() {
    this.getBikeDetailInfo();
  }

  @Watch('params')
  public onchanged(val: any, oldVal: any) {
    this.currentPage = 1;
    this.pageSize = 20;
    this.company = '';
    this.getBikeDetailInfo();
  }

  // 获取列表
  public getBikeDetailInfo(): void {
    API.getBikeDetailInfo({
      terminalId: this.params.terminalId,
      page: this.currentPage,
      pageSize: this.pageSize,
      companyCode: this.company,
    }).then(
      (res: any): void => {
        if (res.status === 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      },
    );
  }

  public handleSizeChange(val: number): void {
    this.pageSize = val;
    this.getBikeDetailInfo();
  }

  public handleCurrentChange(val: number): void {
    this.currentPage = val;
    this.getBikeDetailInfo();
  }
}
</script>

<style lang="scss">
.bleCheck-table {
  .el-select {
    .el-input {
      .el-input__inner {
        color: #fff;
        background-color: transparent;
        border: 1px solid rgba(153, 204, 255, 0.25);
      }
    }
  }
  .el-scrollbar {
    height: 100%;
    width: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      // margin-right: -18px !important;
    }
  }
  .paging {
    color: #c0c4cc;
    button[type='button'] {
      background-color: transparent;
    }
    .el-pager {
      li {
        color: #fff;
        background-color: transparent;
        border-radius: 4px;
        &.active {
          background: #8b3823;
        }
      }
    }
    .el-input__inner {
      border: none;
      background-color: transparent;
    }
  }
}
</style>


<style lang="scss" scoped>
.bleCheck-table {
  position: absolute;
  @include vw2(top, 30);
  @include vw2(left, 240);
  @include vw2(width, 480);
  @include vw2(height, 365);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  display: flex;
  flex-direction: column;
  .close {
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
  .bleCheck-head {
    width: 100%;
    // height: vw(19.2);
    background: rgba(153, 204, 255, 0.2);
    color: #fff;
    @include vw2(font-size, 10);
    @include vw2(line-height, 24);
    text-align: center;
  }
  .bleCheck-body {
    width: 100%;
    height: 1px;
    padding: 0 vw(10);
    box-sizing: border-box;
    flex: 1;
    .screens {
      width: 100%;
      @include vw2(height, 17);
      @include vw2(margin-top, 15);
      @include vw2(margin-bottom, 7);
    }
    .table {
      width: 100%;
      @include vw2(height, 264);
      display: flex;
      flex-direction: column;
      @include vw2(font-size, 8);
      @include vw2(line-height, 24);
      .td1 {
        @include vw2(width, 30);
      }
      .td2 {
        @include vw2(width, 108);
      }
      .td3 {
        @include vw2(width, 53);
      }
      .td4 {
        @include vw2(width, 159);
      }
      .td5 {
        @include vw2(width, 108);
      }
      table {
        border-spacing: 0;
        width: 100%;
        padding: 0;
        margin: 0;
        tr,
        td,
        th {
          padding: 0;
          margin: 0;
        }
      }
      .table-head {
        color: #aaaaaa;
        text-align: center;
        font-weight: bold;
        // margin-right: -1px;
        table {
          border: 1px solid #607391;
          th {
            border-right: 1px solid #607391;
            &:last-of-type {
              border: none;
            }
          }
        }
      }
      .table-body {
        flex: 1;
        height: 1px;
        color: #ffffff;
        text-align: center;
        width: 100%;
        table {
          border-left: 1px solid #607391;
          border-right: 1px solid #607391;
          td {
            border-right: 1px solid #607391;
            border-bottom: 1px solid #607391;
            &:last-of-type {
              border-right: none;
            }
          }
        }
      }
    }
    .paging {
      @include vw2(margin-top, 10);
      width: 100%;
      @include vw2(height, 18);
      text-align: center;
    }
  }
}
</style>
