import { Component, Vue } from 'vue-property-decorator';
import Weather from '@/components/weather/index.vue';
import DateTime from '@/components/dateTime/index.vue';
import { Getter } from 'vuex-class';
@Component({
  components: {
    Weather,
    DateTime,
  },
})
export default class PageTop extends Vue {
  // @Prop() private msg!: string;
  @Getter('pageConfig')
  public pageConfig: any;
}
