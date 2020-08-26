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
        hash: string = '';
        host: string = '';
        hostname: string = '';
        pathname: string = '';
        port: string = '';
        protocol: string = '';
        search: string = '';
        */
        this.hash_ = '';
        this.host_ = '';
        this.hostname_ = '';
        this.pathname_ = '';
        this.port_ = '';
        this.protocol_ = '';
        this.search_ = '';
        this.href_ = '';
        this.ancestorOrigins_ = new RxDOMStringList();
    }
    get hash() { return this.hash_; }
    set hash(hash) { this.hash_ = hash; this.href = this.href; }
    get host() { return this.host_; }
    set host(host) { this.host_ = host; this.href = this.href; }
    get hostname() { return this.hostname_; }
    set hostname(hostname) { this.hostname_ = hostname; this.href = this.href; }
    get pathname() { return this.pathname_; }
    set pathname(pathname) { this.pathname_ = pathname; this.href = this.href; }
    get port() { return this.port_; }
    set port(port) { this.port_ = port; this.href = this.href; }
    get protocol() { return this.protocol_; }
    set protocol(protocol) { this.protocol_ = protocol; this.href = this.href; }
    get search() { return this.search_; }
    set search(search) { this.search_ = search; this.href = this.href; }
    get href() {
        const href = `${this.protocol}//${this.host}${this.port.length ? `:${this.port}` : ``}${this.pathname}${this.search}${this.hash}`;
        this.href_ = href;
        return href;
    }
    set href(href) {
        if (this.href_ !== href) {
            this.href_ = href;
            const location = getLocationComponents(href);
            this.protocol_ = location.protocol;
            this.host_ = location.host;
            this.hostname_ = location.hostname;
            this.port_ = location.port;
            this.pathname_ = location.pathname;
            this.search_ = location.search;
            this.hash_ = location.hash;
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
