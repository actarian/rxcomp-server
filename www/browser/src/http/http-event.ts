export enum HttpEventType {
	Sent,
	UploadProgress,
	ResponseHeader,
	DownloadProgress,
	Response,
	User,
	ResponseError,
}

export interface HttpProgressEvent {
	type: HttpEventType.DownloadProgress | HttpEventType.UploadProgress;
	loaded: number;
	total?: number;
}

export interface HttpDownloadProgressEvent extends HttpProgressEvent {
	type: HttpEventType.DownloadProgress;
	partialText?: string;
}

export interface HttpUploadProgressEvent extends HttpProgressEvent {
	type: HttpEventType.UploadProgress;
}

export interface HttpSentEvent {
	type: HttpEventType.Sent;
}

export interface HttpUserEvent<T> {
	type: HttpEventType.User;
}
