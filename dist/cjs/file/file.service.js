"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var path = require('path');
var fs = require('fs');
var FileService = /** @class */ (function () {
    function FileService() {
    }
    FileService.exists = function (pathname) {
        return fs.existsSync(pathname);
    };
    FileService.exists$ = function (pathname) {
        return rxjs_1.Observable.create(function (observer) {
            try {
                fs.access(pathname, fs.constants.F_OK, function (error) {
                    var exists = !error;
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
    };
    FileService.readFile = function (pathname) {
        var dirname = path.dirname(pathname);
        if (!fs.existsSync(dirname)) {
            return null;
        }
        return fs.readFileSync(pathname, 'utf8');
    };
    FileService.readFile$ = function (pathname) {
        return rxjs_1.Observable.create(function (observer) {
            try {
                fs.readFile(pathname, 'utf8', function (error, data) {
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
    };
    FileService.writeFile = function (pathname, content) {
        try {
            var dirname = path.dirname(pathname);
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
    };
    FileService.writeFile$ = function (pathname, content) {
        return rxjs_1.Observable.create(function (observer) {
            try {
                var dirname = path.dirname(pathname);
                fs.mkdir(dirname, { recursive: true }, function (error) {
                    if (error) {
                        observer.next(false);
                        observer.complete();
                        return;
                        // return observer.error(error);
                    }
                    fs.writeFile(pathname, content, 'utf8', function (error) {
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
    };
    FileService.unlinkFile = function (pathname) {
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
    };
    FileService.unlinkFile$ = function (pathname) {
        return rxjs_1.Observable.create(function (observer) {
            try {
                fs.unlink(pathname, function (error) {
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
    };
    return FileService;
}());
exports.default = FileService;
