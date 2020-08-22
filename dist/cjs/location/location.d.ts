export interface IDOMStringList extends DOMStringList {
    readonly length: number;
    contains(string: string): boolean;
    item(index: number): string | null;
    [index: number]: string;
}
export declare class RxDOMStringList extends Array<string> implements IDOMStringList {
    contains(string: string): boolean;
    item(index: number): string | null;
}
export interface ILocation extends Location {
}
export declare class RxLocation implements ILocation {
    hash: string;
    host: string;
    hostname: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
    private href_;
    get href(): string;
    set href(href: string);
    get origin(): string;
    private ancestorOrigins_;
    get ancestorOrigins(): DOMStringList;
    assign(url: string): void;
    reload(): void;
    replace(url: string): void;
    toString(): string;
    private static location_;
    static get location(): ILocation;
}
