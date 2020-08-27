import { Observable, Observer } from "rxjs";
const path = require('path');
const fs = require('fs');

export default class FileService {

	protected static exists(pathname: string): boolean {
		return fs.existsSync(pathname);
	}

	protected static exists$(pathname: string): Observable<boolean> {
		return Observable.create((observer: Observer<boolean>) => {
			try {
				fs.access(pathname, fs.constants.F_OK, (error: Error) => {
					const exists: boolean = !error;
					observer.next(exists);
					observer.complete();
				});
			} catch (error) {
				console.log('FileService.exists$.error', error);
				observer.next(false);
				observer.complete();
				// observer.error(error);
			}
		});
	}

	protected static readFile(pathname: string): string | null {
		const dirname: string = path.dirname(pathname);
		if (!fs.existsSync(dirname)) {
			return null;
		}
		return fs.readFileSync(pathname, 'utf8');
	}

	protected static readFile$(pathname: string): Observable<string | null> {
		return Observable.create((observer: Observer<string | null>) => {
			try {
				fs.readFile(pathname, 'utf8', (error: Error, data: string) => {
					// return observer.error(error);
					observer.next(error ? null : data);
					observer.complete();
				});
				// sync
				// observer.next(this.readFile(pathname));
				// observer.complete();
			} catch (error) {
				console.log('FileService.readFile$.error', error);
				observer.next(null);
				observer.complete();
				// observer.error(error);
			}
		});
	}

	protected static writeFile(pathname: string, content: string): boolean {
		try {
			const dirname: string = path.dirname(pathname);
			if (!fs.existsSync(dirname)) {
				fs.mkdirSync(dirname);
			}
			fs.writeFileSync(pathname, content, 'utf8');
			return true;
		} catch (error) {
			console.log('FileService.writeFile.error', error);
			return false;
		}
	}

	protected static writeFile$(pathname: string, content: string): Observable<boolean> {
		return Observable.create((observer: Observer<boolean>) => {
			try {
				const dirname: string = path.dirname(pathname);
				fs.mkdir(dirname, { recursive: true }, (error: Error) => {
					if (error) {
						observer.next(false);
						observer.complete();
						return;
						// return observer.error(error);
					}
					fs.writeFile(pathname, content, 'utf8', (error: Error) => {
						observer.next(!error);
						observer.complete();
					});
				});
				// sync
				// this.writeFile(pathname, content);
				// observer.next(true);
				// observer.complete();
			} catch (error) {
				console.log('FileService.writeFile$.error', error);
				observer.next(false);
				observer.complete();
				// observer.error(error);
			}
		});
	}

	protected static unlinkFile(pathname: string): boolean {
		try {
			if (fs.existsSync(pathname)) {
				fs.unlinkSync(pathname);
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.log('FileService.unlinkFile.error', error);
			return false;
		}
	}

	protected static unlinkFile$(pathname: string): Observable<boolean> {
		return Observable.create((observer: Observer<boolean>) => {
			try {
				fs.unlink(pathname, (error: Error) => {
					observer.next(!error);
					observer.complete();
					// return observer.error(error);
				});
				// sync
				// this.unlinkFile(pathname);
				// observer.next(true);
				// observer.complete();
			} catch (error) {
				console.log('FileService.unlinkFile$.error', error);
				observer.next(false);
				// observer.error(error);
			}
		});
	}
}
