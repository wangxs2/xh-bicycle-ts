import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { arrGroup } from '@/libs/util.ts';
import slideshow from '@/components/slideshow/index.vue';

@Component({
  components: {
    slideshow,
  },
})
export default class Command extends Vue {
  @Prop()
  private townData!: any[]; // 街镇数据

  // 处理数据
  private townDataing: any[] = [];

  // swiper配置
  private swiperOption: any = {};

  // 加载swiper
  private initSwiper: boolean = false;

  @Watch('townData')
  public onchanged(val: any[], oldVal: any[]) {
    if (val.length) {
      this.$nextTick(function() {
        this.initSwiper = true;
        this.disData();
      });
    }
  }
  // 随机8位电话
  private getMoble() {
    var prefix = ''
    for (var j = 0; j < 8; j++) {
      prefix = prefix + Math.floor(Math.random() * 10)
      if (j == 0) {
        prefix == '0' ? '3' : prefix
      }
    }
    return prefix
  }

  // 处理数据
  private disData(): void {
    const townData = this.townData.map(
      (item: any): object => {
        return {
          name: item.orgName,
          // phone1: '--',
          // phone2: '--',
          phone1: this.getMoble(),
          phone2: this.getMoble(),
        };
      },
    );

    this.swiperOption = {
      autoplay: {
        delay: 10000, // 切换时间
      },
      simulateTouch: false,
      observer: true, // 修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, // 修改swiper的父元素时，自动初始化swiper
      loop: true,
      $isNav: false,
      navigation: {
        nextEl: '.command-handle .left-arrow',
        prevEl: '.command-handle .right-arrow',
      },
    };

    this.townDataing = arrGroup(townData, 6);
  }
}
