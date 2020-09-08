import { getLocationComponents, ILocationInit } from "rxcomp";

export interface IDOMStringList extends DOMStringList {
	// Returns the number of strings in strings.
	readonly length: number;
	// Returns true if strings contains string, and false otherwise.
	contains(string: string): boolean;
	// Returns the string with index index from strings.
	item(index: number): string | null;
	[index: number]: string;
}
export class RxDOMStringList extends Array<string> implements IDOMStringList {
	/*
	private list_: string[] = [];
	get length(): number {
		return this.list_.length;
	}
	*/
	contains(string: string): boolean {
		// return this.list_.indexOf(string) !== -1;
		return this.indexOf(string) !== -1;
	}
	item(index: number): string | null {
		// if (index > 0 && index < this.list_.length) {
		if (index > 0 && index < this.length) {
			// return this.list_[index];
			return this[index];
		} else {
			return null;
		}
	};
	// [index: number]: string;
}
export interface ILocation extends Location {
	/*
	hash: string; // Returns the Location object's URL's fragment (includes leading "#" if non-empty). Can be set, to navigate to the same URL with a changed fragment (ignores leading "#").
	host: string; // Returns the Location object's URL's host and port (if different from the default port for the scheme). Can be set, to navigate to the same URL with a changed host and port.
	hostname: string; // Returns the Location object's URL's host. Can be set, to navigate to the same URL with a changed host.
	pathname: string; // Returns the Location object's URL's path. Can be set, to navigate to the same URL with a changed path.
	port: string; // Returns the Location object's URL's port. Can be set, to navigate to the same URL with a changed port.
	protocol: string; // Returns the Location object's URL's scheme. Can be set, to navigate to the same URL with a changed scheme.
	search: string; // Returns the Location object's URL's query (includes leading "?" if non-empty). Can be set, to navigate to the same URL with a changed query (ignores leading "?").
	href: string; // Returns the Location object's URL. Can be set, to navigate to the given URL.
	readonly origin: string; // Returns the Location object's URL's origin.
	readonly ancestorOrigins: DOMStringList; // Returns a DOMStringList object listing the origins of the ancestor browsing contexts, from the parent browsing context to the top-level browsing context.
	assign(url: string): void; // Navigates to the given URL.
	reload(): void; // reload(forcedReload: boolean): void; // @deprecated
	replace(url: string): void; // Removes the current page from the session history and navigates to the given URL.
	toString(): string;
	*/
}
export class RxLocation implements ILocation {
	/*
	hash: string = '';
	host: string = '';
	hostname: string = '';
	pathname: string = '';
	port: string = '';
	protocol: string = '';
	search: string = '';
	*/
	private hash_: string = '';
	get hash(): string { return this.hash_; }
	set hash(hash: string) { this.hash_ = hash; this.href = this.href; }
	private host_: string = '';
	get host(): string { return this.host_; }
	set host(host: string) { this.host_ = host; this.href = this.href; }
	private hostname_: string = '';
	get hostname(): string { return this.hostname_; }
	set hostname(hostname: string) { this.hostname_ = hostname; this.href = this.href; }
	private pathname_: string = '';
	get pathname(): string { return this.pathname_; }
	set pathname(pathname: string) { this.pathname_ = pathname; this.href = this.href; }
	private port_: string = '';
	get port(): string { return this.port_; }
	set port(port: string) { this.port_ = port; this.href = this.href; }
	private protocol_: string = '';
	get protocol(): string { return this.protocol_; }
	set protocol(protocol: string) { this.protocol_ = protocol; this.href = this.href; }
	private search_: string = '';
	get search(): string { return this.search_; }
	set search(search: string) { this.search_ = search; this.href = this.href; }
	private href_: string = '';
	get href(): string {
		const href: string = `${this.protocol}//${this.host}${this.port.length ? `:${this.port}` : ``}${this.pathname}${this.search}${this.hash}`;
		this.href_ = href;
		return href;
	}
	set href(href: string) {
		if (this.href_ !== href) {
			this.href_ = href;
			const location: ILocationInit = getLocationComponents(href);
			this.protocol_ = location.protocol;
			this.host_ = location.host;
			this.hostname_ = location.hostname;
			this.port_ = location.port;
			this.pathname_ = location.pathname;
			this.search_ = location.search;
			this.hash_ = location.hash;
		}
	}
	get origin(): string {
		return `${this.protocol}//${this.host}${this.port.length ? `:${this.port}` : ``}`;
	}
	private ancestorOrigins_: IDOMStringList = new RxDOMStringList();
	get ancestorOrigins(): DOMStringList {
		return this.ancestorOrigins_;
	}
	assign(url: string): void {
		this.href = url;
	}
	reload(): void { }
	replace(url: string): void {
		this.href = url;
	}
	toString(): string {
		return this.href;
	}
	private static location_: ILocation;
	static get location(): ILocation {
		if (this.location_) {
			return this.location_;
		} else {
			return this.location_ = new RxLocation();
		}
	}
}
