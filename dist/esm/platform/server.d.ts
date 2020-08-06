import { IElement, Module, Platform } from 'rxcomp';
export default class Server extends Platform {
    static bootstrap(moduleFactory?: typeof Module, html?: string): Module;
    static querySelector(selector: string): IElement | null;
    static serialize(): string;
}
