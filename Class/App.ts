//ToDo alias imports
//ToDo ReadMe
import Dot from "./Dot";
import appConfig from '../app.config'

export default class App {
    private readonly canvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D;

    private animationProgress: number = 0; /* 0 -> starting; 1 -> fully finished */
    private lastFrameStartTime: number = Date.now();
    private dotsInstances: Dot[] = [];

    constructor() {
        this.canvas = App.getDOMElement('#board') as HTMLCanvasElement
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

        this.updateDotsInstances();
        this.animationRecursion()
        this.bindUIActions()
    }

    private static getDOMElement(selector: string): Element {
        const elementToReturn = document.querySelector(selector)
        if (!elementToReturn) {
            throw new Error(`'${selector}' is missing`)
        }

        return elementToReturn;
    }

    private bindUIActions() {
        const menuElement = App.getDOMElement('.app-menu')
        const getConfigKeyForInputID = (id: string) => {
            switch (id) {
                case 'center-dot':
                    return 'centerDotVisible'
                case 'dot-radius':
                    return 'dotRadius'
                case 'cycle-speed':
                    return 'dotMovePeriod'
                case 'dots-amount':
                    return 'dotsAmount'
                case 'path-distance':
                    return 'dotPathDistance'
                default:
                    throw Error(`Input id not matched ${id}`)
            }
        }

        /* ToDo Save and load user saved cookies settings */
        /* Apply default values */
        for (const input of Array.prototype.slice.call(menuElement.querySelectorAll('input'))) {
            const inputValue = appConfig[getConfigKeyForInputID(input.id)]

            input[(typeof inputValue === 'boolean') ? 'checked' : 'value'] = inputValue
        }

        /* Update config */
        menuElement.addEventListener('change', (event) => {
            if (!(event.target instanceof HTMLInputElement)) {
                return;
            }

            const inputKey = getConfigKeyForInputID(event.target.id);

            if (inputKey === 'centerDotVisible') {
                appConfig[inputKey] = event.target.checked;
            } else {
                appConfig[inputKey] = parseInt(event.target.value);

                if (inputKey === 'dotsAmount') {
                    this.updateDotsInstances()
                }
            }

        })
    }

    private adjustCanvasSize() {
        this.canvas.height = window.innerHeight
        this.canvas.width = window.innerWidth
    }

    private updateAnimationProgressIndicator() {
        const currentTime = Date.now();

        this.animationProgress += ((currentTime - this.lastFrameStartTime) / appConfig.dotMovePeriod)

        while (this.animationProgress >= 1) {
            this.animationProgress--;
        }

        this.lastFrameStartTime = currentTime;
    }

    private animationRecursion() {
        this.adjustCanvasSize()
        this.drawFrame()
        this.updateAnimationProgressIndicator()

        requestAnimationFrame(this.animationRecursion.bind(this))
    }


    private drawFrame() {
        const canvasCenterCords: ICords = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }

        /* Move to center */
        this.context.translate(canvasCenterCords.x, canvasCenterCords.y);

        /* Clear prev frame */
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        /* Draw dots */
        for (const dotInstance of this.dotsInstances) {
            dotInstance.draw(this.animationProgress)
        }

        if (appConfig.centerDotVisible) {
            this.context.beginPath()
            this.context.arc(0, 0, 4, 0, Math.PI * 2);
            this.context.fillStyle = '#ffffff'
            this.context.fill()
            this.context.stroke()
            this.context.closePath()

        }

        this.context.translate(-canvasCenterCords.x, -canvasCenterCords.y);
    }

    private updateDotsInstances() {
        this.dotsInstances = [];

        for (let i = 0; i < appConfig.dotsAmount; i++) {
            this.dotsInstances.push(new Dot(this.context, Math.PI / (appConfig.dotsAmount) * i))
        }
    }
}