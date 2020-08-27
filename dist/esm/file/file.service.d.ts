import { Observable } from "rxjs";
export default class FileService {
    protected static exists(pathname: string): boolean;
    protected static exists$(pathname: string): Observable<boolean>;
    protected static readFile(pathname: string): string | null;
    protected static readFile$(pathname: string): Observable<string | null>;
    protected static writeFile(pathname: string, content: string): boolean;
    protected static writeFile$(pathname: string, content: string): Observable<boolean>;
    protected static unlinkFile(pathname: string): boolean;
    protected static unlinkFile$(pathname: string): Observable<boolean>;
}
