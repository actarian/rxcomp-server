const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { todo } = require('./todo/todo');

const inputs = [
  ...todo.inputs,
];

const types = [
  ...todo.types,
];

const mutations = [
  ...todo.mutations,
];

const queries = [
  ...todo.queries,
];

const schema = `
${inputs.join('\n\t')}

${types.join('\n\t')}

type Mutation {
	${mutations.join('\n\t')}
}

type Query {
	hello: String
	roll(dices: Int!, sides: Int): [Int]
	${queries.join('\n\t')}
}
`;

const rootValue = Object.assign({
  hello: () => {
    return 'Hello world!';
  },
  roll: ({ dices, sides }) => {
    const results = [];
    for (let i = 0; i < dices; i++) {
      results.push(1 + Math.floor(Math.random() * (sides || 6)));
    }
    return results;
  },
}, todo.methods);

// console.log('NodeJs.Api.schema', schema);

function useApi() {
  return graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: rootValue,
    graphiql: true,
  });
}

module.exports = {
  useApi: useApi,
};
