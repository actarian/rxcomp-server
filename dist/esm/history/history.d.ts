export interface IHistoryItem {
    data: any;
    title: string;
    url?: string | null;
}
export interface IHistory extends History {
}
export declare class RxHistory implements IHistory {
    private currentIndex_;
    private history_;
    get length(): number;
    scrollRestoration: ScrollRestoration;
    state: any;
    back(): void;
    forward(): void;
    go(delta?: number): void;
    pushState(data: any, title: string, url?: string | null): void;
    replaceState(data: any, title: string, url?: string | null): void;
    private static history_;
    static get history(): IHistory;
}
