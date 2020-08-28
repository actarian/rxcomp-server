import { Observable } from "rxjs";
export default class FileService {
    static exists(pathname: string): boolean;
    static exists$(pathname: string): Observable<boolean>;
    static readFile(pathname: string): string | null;
    static readFile$(pathname: string): Observable<string | null>;
    static writeFile(pathname: string, content: string): boolean;
    static writeFile$(pathname: string, content: string): Observable<boolean>;
    static unlinkFile(pathname: string): boolean;
    static unlinkFile$(pathname: string): Observable<boolean>;
}
