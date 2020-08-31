
export interface ITodoItem {
	id: number;
	title: string;
	completed: boolean;
}

export interface IGetTodos {
	getTodos: ITodoItem[]
}

export interface IResponseData {
	data: IGetTodos;
}
