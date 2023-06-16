const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
var PROTO_PATH = __dirname + '/../server/auth.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var auth_proto = grpc.loadPackageDefinition(packageDefinition).auth;
const target_grpc = 'localhost:50051';
const target_gql = 'localhost:4000/graphql';

// Testing values
const Authentications = [
    { user: 'Admin', password: '123456789', authenticated: true },
    { user: 'User', password: '123456ABC', authenticated: false },
    { user: 'Guest', password: 'ABC12345', authenticated: false },
]

// GraphQL Definitions
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean
} = require('graphql')

const AuthType = new GraphQLObjectType({
    name: 'AuthRecord',
    fields: () => ({
        user: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        authenticated: { type: new GraphQLNonNull(GraphQLBoolean) },
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

function authenticate(user, password){
    var client = new auth_proto.Authenticator(target_grpc, grpc.credentials.createInsecure());
    client.authenticate({user: user, password: password}, function(err, response) {
        console.log('Authentication: user:' + user + ' password:' + password + ' authenticated:'  + response.authenticated);
    });
    return response.authenticated;
}

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
                        authenticated: authenticate(args.user, args.password),
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
console.log("Running GraphQL on " + target_gql);
console.log("Running gRPC on " + target_grpc);
