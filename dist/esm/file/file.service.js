import { Observable } from "rxjs";
const path = require('path');
const fs = require('fs');
export default class FileService {
    static exists(pathname) {
        return fs.existsSync(pathname);
    }
    static exists$(pathname) {
        return Observable.create((observer) => {
            try {
                fs.access(pathname, fs.constants.F_OK, (error) => {
                    const exists = !error;
                    observer.next(exists);
                    observer.complete();
                });
            }
            catch (error) {
                console.log('FileService.exists$.error', error);
                observer.next(false);
                observer.complete();
                // observer.error(error);
            }
        });
    }
    static readFile(pathname) {
        const dirname = path.dirname(pathname);
        if (!fs.existsSync(dirname)) {
            return null;
        }
        return fs.readFileSync(pathname, 'utf8');
    }
    static readFile$(pathname) {
        return Observable.create((observer) => {
            try {
                fs.readFile(pathname, 'utf8', (error, data) => {
                    // return observer.error(error);
                    observer.next(error ? null : data);
                    observer.complete();
                });
                // sync
                // observer.next(this.readFile(pathname));
                // observer.complete();
            }
            catch (error) {
                console.log('FileService.readFile$.error', error);
                observer.next(null);
                observer.complete();
                // observer.error(error);
            }
        });
    }
    static writeFile(pathname, content) {
        try {
            const dirname = path.dirname(pathname);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }
            fs.writeFileSync(pathname, content, 'utf8');
            return true;
        }
        catch (error) {
            console.log('FileService.writeFile.error', error);
            return false;
        }
    }
    static writeFile$(pathname, content) {
        return Observable.create((observer) => {
            try {
                const dirname = path.dirname(pathname);
                fs.mkdir(dirname, { recursive: true }, (error) => {
                    if (error) {
                        observer.next(false);
                        observer.complete();
                        return;
                        // return observer.error(error);
                    }
                    fs.writeFile(pathname, content, 'utf8', (error) => {
                        observer.next(!error);
                        observer.complete();
                    });
                });
                // sync
                // this.writeFile(pathname, content);
                // observer.next(true);
                // observer.complete();
            }
            catch (error) {
                console.log('FileService.writeFile$.error', error);
                observer.next(false);
                observer.complete();
                // observer.error(error);
            }
        });
    }
    static unlinkFile(pathname) {
        try {
            if (fs.existsSync(pathname)) {
                fs.unlinkSync(pathname);
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.log('FileService.unlinkFile.error', error);
            return false;
        }
    }
    static unlinkFile$(pathname) {
        return Observable.create((observer) => {
            try {
                fs.unlink(pathname, (error) => {
                    observer.next(!error);
                    observer.complete();
                    // return observer.error(error);
                });
                // sync
                // this.unlinkFile(pathname);
                // observer.next(true);
                // observer.complete();
            }
            catch (error) {
                console.log('FileService.unlinkFile$.error', error);
                observer.next(false);
                // observer.error(error);
            }
        });
    }
}
