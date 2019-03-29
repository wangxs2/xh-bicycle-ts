import { Component, Prop, Vue } from 'vue-property-decorator'
import Weather from '@/components/weather/index.vue'
import DateTime from '@/components/dateTime/index.vue'

@Component({
  components: {
    Weather,
    DateTime
  }
})
export default class PageTop extends Vue {
  // @Prop() private msg!: string;
}
