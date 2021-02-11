declare module "*.png" {
    const content: any;
    export default content;
}

interface ICords {
    x: number
    y: number
}

interface IAppConfig {
    dotsAmount: number,
    dotRadius: number, /* px */
    dotPathDistance: number, /* px */
    dotMovePeriod: number, /* ms */
    centerDotVisible: boolean,
    palette: string[]
}