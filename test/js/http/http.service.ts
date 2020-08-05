import { Observable, of } from 'rxjs';

export default class HttpService {

	static get$(url: string, data: any, format: string): Observable<any> {
		// simulate api call
		return of(data);
	}

	static delete$(url: string): Observable<any> {
		// simulate api call
		return of();
	}

	static post$(url: string, data: any): Observable<any> {
		// simulate api call
		return of(data);
	}

	static put$(url: string, data: any): Observable<any> {
		// simulate api call
		return of(data);
	}

	static patch$(url: string, data: any): Observable<any> {
		// simulate api call
		return of(data);
	}

}
