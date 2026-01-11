declare module "*/ScrollSmoother.js" {
  export class ScrollSmoother {
    static create(vars: any): ScrollSmoother;
    static get(): ScrollSmoother;
    paused(value?: boolean): boolean;
    scrollTo(target: any, smooth?: boolean, position?: string | number): void;
    offset(target: any, position?: any): number;
    kill(): void;
  }
}
