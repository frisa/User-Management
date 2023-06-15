const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

// Testing values
const Authentications = [
    { user: 'Admin', password: '12345' },
    { user: 'User', password: '12345678' },
]

// GraphQL Definitions
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLSchema
} = require('graphql')

const AuthType = new GraphQLObjectType({
    name: 'AuthRecord',
    fields: () => ({
        user: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        authentications: {
            type: new GraphQLList(AuthType),
            resolve: () => Authentications
        }
    })
})

const RootMutationType = new GraphQLObjectType(
    {
        name: 'Mutation',
        description: 'Root Mutation',
        fields: () => ({
            addAuthentication: {
                type: AuthType,
                description: 'Add new authentication',
                args: {
                    user: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                    ,
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (root, args) => {
                    const newAuth = {
                        user: args.user,
                        password: args.password,
                    }
                    Authentications.push(newAuth)
                    return newAuth
                }
            }
        }
        )
    }
)

const gqlSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

// GraphQL API Server
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({ schema: gqlSchema, graphiql: true }));
app.listen(4000);
console.log("Running GraphQL API server on localhost:4000/graphql");
