import { Component, Vue } from 'vue-property-decorator';
import screenfull from 'screenfull';

@Component
export default class Login extends Vue {
  // 错误信息
  private errorMessage: string = '';
  // key值登陆
  // 浦东 jCoQfQWsUWlpRyWLQxmgdA%3D%3D
  // 徐汇 UouLaDG9Dt931%7CVrNZp2nQ%3D%3D
  //合肥  8mUkuFU5BQDahkzZOky4aA%3D%3D
  private userKey: string = '';

  private login(): void {
    if (this.userKey) {
      // 记录key 值
      sessionStorage.setItem('KEY', this.userKey);

      this.full();
      this.$router.push('/layout');
    }
  }

  private full(): void {
    if ((screenfull as any).enabled) {
      (screenfull as any).request();
    }
  }
}
