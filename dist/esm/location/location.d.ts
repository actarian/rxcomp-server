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
    private hash_;
    get hash(): string;
    set hash(hash: string);
    private host_;
    get host(): string;
    set host(host: string);
    private hostname_;
    get hostname(): string;
    set hostname(hostname: string);
    private pathname_;
    get pathname(): string;
    set pathname(pathname: string);
    private port_;
    get port(): string;
    set port(port: string);
    private protocol_;
    get protocol(): string;
    set protocol(protocol: string);
    private search_;
    get search(): string;
    set search(search: string);
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
