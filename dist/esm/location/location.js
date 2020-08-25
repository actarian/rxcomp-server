import { getLocationComponents } from "rxcomp";
export class RxDOMStringList extends Array {
    /*
    private list_: string[] = [];
    get length(): number {
        return this.list_.length;
    }
    */
    contains(string) {
        // return this.list_.indexOf(string) !== -1;
        return this.indexOf(string) !== -1;
    }
    item(index) {
        // if (index > 0 && index < this.list_.length) {
        if (index > 0 && index < this.length) {
            // return this.list_[index];
            return this[index];
        }
        else {
            return null;
        }
    }
    ;
}
export class RxLocation {
    constructor() {
        /*
        private hash_: string = '';
        get hash(): string { return this.hash_; }
        set hash(hash: string) { this.hash_ = hash; updateLocation_(this); }
    
        private host_: string = '';
        get host(): string { return this.host_; }
        set host(host: string) { this.host_ = host; updateLocation_(this); }
    
        private hostname_: string = '';
        get hostname(): string { return this.hostname_; }
        set hostname(hostname: string) { this.hostname_ = hostname; updateLocation_(this); }
    
        private pathname_: string = '';
        get pathname(): string { return this.pathname_; }
        set pathname(pathname: string) { this.pathname_ = pathname; updateLocation_(this); }
    
        private port_: string = '';
        get port(): string { return this.port_; }
        set port(port: string) { this.port_ = port; updateLocation_(this); }
    
        private protocol_: string = '';
        get protocol(): string { return this.protocol_; }
        set protocol(protocol: string) { this.protocol_ = protocol; updateLocation_(this); }
    
        private search_: string = '';
        get search(): string { return this.search_; }
        set search(search: string) { this.search_ = search; updateLocation_(this); }
        */
        this.hash = '';
        this.host = '';
        this.hostname = '';
        this.pathname = '';
        this.port = '';
        this.protocol = '';
        this.search = '';
        this.href_ = '';
        this.ancestorOrigins_ = new RxDOMStringList();
    }
    get href() {
        const href = `${this.protocol}//${this.host}${this.port.length ? `:${this.port}` : ``}${this.pathname}${this.search}${this.hash}`;
        this.href_ = href;
        return href;
    }
    set href(href) {
        if (this.href_ !== href) {
            this.href_ = href;
            const location = getLocationComponents(href);
            this.protocol = location.protocol;
            this.host = location.host;
            this.hostname = location.hostname;
            this.port = location.port;
            this.pathname = location.pathname;
            this.search = location.search;
            this.hash = location.hash;
        }
    }
    get origin() {
        return `${this.protocol}//${this.host}${this.port.length ? `:${this.port}` : ``}`;
    }
    get ancestorOrigins() {
        return this.ancestorOrigins_;
    }
    assign(url) {
        this.href = url;
    }
    reload() { }
    replace(url) {
        this.href = url;
    }
    toString() {
        return this.href;
    }
    static get location() {
        if (this.location_) {
            return this.location_;
        }
        else {
            return this.location_ = new RxLocation();
        }
    }
}
