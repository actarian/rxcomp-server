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
	hash: string = '';
	host: string = '';
	hostname: string = '';
	pathname: string = '';
	port: string = '';
	protocol: string = '';
	search: string = '';
	private href_: string = '';
	get href(): string {
		const href: string = `${this.protocol}//${this.host}${this.port.length ? `:${this.port}` : ``}${this.pathname}${this.search}${this.hash}`;
		this.href_ = href;
		return href;
	}
	set href(href: string) {
		if (this.href_ !== href) {
			this.href_ = href;
			const regExp: RegExp = /^((http\:|https\:)?\/\/)?((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])|locahost)?(\:([^\/]+))?(\.?\/[^\?]+)?(\?[^\#]+)?(\#.+)?$/g;
			const matches = href.matchAll(regExp);
			for (let match of matches) {
				/*
				Group 0.  https://developer.mozilla.org/en-US/docs/Web/API/Location/ancestorOrigins?pippo=shuter&a=dsok#asoka
				Group 1.  https://
				Group 2.  https:
				Group 3.  developer.mozilla.org
				Group 7.  mozilla.
				Group 8.  mozilla
				Group 9.  org
				Group 12. /en-US/docs/Web/API/Location/ancestorOrigins
				Group 13. ?pippo=shuter&a=dsok
				Group 14. #asoka
				*/
				this.protocol = match[2] || '';
				this.host = this.hostname = match[3] || '';
				this.port = match[11] || '';
				this.pathname = match[12] || '';
				this.search = match[13] || '';
				this.hash = match[14] || '';
			}
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

/*
function updateLocation_(location: ILocation): void {
	location.href = location.href;
}
*/
