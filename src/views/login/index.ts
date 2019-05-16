import { Component, Vue } from 'vue-property-decorator';
import screenfull from 'screenfull';
import { State, Mutation } from 'vuex-class';

@Component
export default class Login extends Vue {
  // 错误信息
  private errorMessage: string = '';
  // key值登陆
  private userKey: string = 'UouLaDG9Dt931%7CVrNZp2nQ%3D%3D';

  private login(): void {
    if (this.userKey) {
      // this.$store.commit('SETKEY', this.userKey)
      // 记录key 值
      sessionStorage.setItem('KEY', this.userKey);
      // 记录登陆状态
      sessionStorage.setItem('isLogin', 'true');
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
