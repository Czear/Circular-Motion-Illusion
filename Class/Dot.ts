import appConfig from '../app.config'

export default class Dot {
    private readonly context: CanvasRenderingContext2D;
    private readonly sin_padding: number /* RAD's */
    private readonly color: string;


    constructor(context: CanvasRenderingContext2D, sin_padding: number) {
        this.context = context
        this.sin_padding = sin_padding
        this.color = appConfig.palette[Math.floor(Math.random() * appConfig.palette.length)]
    }
    
    public draw(animationProgress: number) {
        const sinValue = Math.sin(2 * Math.PI * animationProgress + this.sin_padding)
        const prevFillColor = this.context.fillStyle;

        /* Begin */
        this.context.rotate(this.sin_padding);
        this.context.beginPath()

        /* Draw circle */
        this.context.arc(0, -appConfig.dotPathDistance / 2 * sinValue, appConfig.dotRadius, 0, Math.PI * 2);
        this.context.fillStyle = this.color
        this.context.fill()

        /* Reset color */
        this.context.fillStyle = prevFillColor

        /* End draw */
        this.context.closePath()
        this.context.rotate(-this.sin_padding);
    }
}