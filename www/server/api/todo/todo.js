// fake db
const db = {
	'1': {
		"id": 1,
		"title": "delectus aut autem",
		"completed": false
	},
	'2': {
		"id": 2,
		"title": "quis ut nam facilis et officia qui",
		"completed": false
	},
	'3': {
		"id": 3,
		"title": "fugiat veniam minus",
		"completed": false
	},
	'4': {
		"id": 4,
		"title": "et porro tempora",
		"completed": true
	},
	'5': {
		"id": 5,
		"title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
		"completed": false
	}
};

class Todo {
	constructor(id, { title, completed }) {
		this.id = id;
		this.title = title;
		this.completed = completed;
	}
}

const inputs = [
`input TodoInput {
	title: String
	completed: Boolean
}`,
];

const types = [
`type Todo {
	id: ID!
	title: String
	completed: Boolean
}`,
];

const mutations = [
`createTodo(input: TodoInput): Todo`,
`updateTodo(id: ID!, input: TodoInput): Todo`,
];

const queries = [
`getTodos: [Todo]`,
`getTodo(id: ID!): Todo`,
];

const methods = {
	createTodo: ({ input }) => {
		const id = new Date().getTime();
		db[id] = input;
		return new Todo(id, input);
	},
	updateTodo: ({ id, input }) => {
		if (!db[id]) {
			throw new Error(`no Todo exists with id ${id}`);
		}
		db[id] = input;
		return new Todo(id, input);
	},
	getTodos: () => {
		return Object.keys(db).map(id => new Todo(id, db[id]));
	},
	getTodo: ({ id }) => {
		if (!db[id]) {
			throw new Error(`no Todo exists with id ${id}`);
		}
		return new Todo(id, db[id]);
	},
};

module.exports = {
	todo: {
		inputs,
		types,
		queries,
		mutations,
		methods,
	},
};
