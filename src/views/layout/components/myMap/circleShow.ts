import { refinedCal } from '@/libs/util.ts'
// import Tween from '@/libs/Tween'

class CircleShow {
  // 圆心
  private center: Array<number | string> = []
  // 圆的大小
  private radius: number = 0
  // 扩散层数
  private level: number = 1
  // 颜色对象
  private color: any = null
  // 终止透明度
  private endOpacity: number = 0.1
  // 每步的透明度
  private speedOpacity: number = 0

  // 速度
  private speed: number = 0

  // 间隔时间 毫秒
  private distance: number = 800

  // 覆盖物集合
  private circles: Array<any> = []

  // 覆盖物容器
  public circleGroup: any = new AMap.OverlayGroup()

  // 计时器
  private clock: number = 0

  constructor(params: any) {
    this.radius = params.radius
    this.level = params.level
    this.color = params.color
    this.center = params.center

    if (!this.color || !this.color.fillColor) {
      this.color = {
        fillColor: 'blue',
        fillOpacity: 0.5
      }
    }

    this.speedOpacity = refinedCal(
      `(${this.color.fillOpacity}-${this.endOpacity})/${this.radius}`,
      -1
    )

    this.speed = this.radius / (this.level * this.distance)

    this.initCircle()
  }

  // 初始化圆
  private initCircle() {
    let circle: any = null
    for (let i = 0; i < this.level; i++) {
      circle = new AMap.CircleMarker({
        center: this.center,
        radius: (this.radius / this.level) * i,
        fillColor: this.color.fillColor,
        fillOpacity: this.color.fillOpacity,
        strokeColor: this.color.fillColor,
        strokeWeight: 1,
        strokeOpacity: this.color.fillOpacity
      })
      this.circles.push(circle)
    }
    this.circleGroup.addOverlays(this.circles)
    this.start()
  }

  public start(): void {
    const now = Date.now()
    window.requestAnimationFrame(this.animation.bind(this))
  }

  // 动画
  private animation(): void {
    // 每帧 步长
    // const speed = this.speed * 16.77
    const speed = this.speed * 30
    // 半径
    let radius = 0
    // 透明度
    let colorOp = 0

    this.circles.forEach(circle => {
      radius = circle.getRadius() + speed
      radius = radius >= this.radius ? 0 : radius
      colorOp = (this.radius - radius) * this.speedOpacity
      circle.setOptions({
        radius,
        fillColor: this.color.fillColor,
        strokeColor: this.color.fillColor,
        strokeOpacity: colorOp,
        fillOpacity: colorOp
      })
    })

    this.clock = window.requestAnimationFrame(this.animation.bind(this))
  }

  public end(): void {
    this.circleGroup.setOptions({
      radius: 0
    })
    window.cancelAnimationFrame(this.clock)
  }

  public clear(): void {
    this.end()
    this.circleGroup.clearOverlays()
  }
}

export default CircleShow
