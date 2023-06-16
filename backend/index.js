const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

const PROTO_PATH = __dirname + '/../server/auth.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const util = require('util')


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

async function callService(req, service_name){
    const res = await service_name(req)
    console.log('authenticated: ' + res.authenticated)
    return res.authenticated
}

function authenticate(user, password){
    var client = new auth_proto.Authenticator(target_grpc, grpc.credentials.createInsecure());
    const promis_authenticate = util.promisify(client.authenticate).bind(client)
    return callService({ user: user, password: password }, promis_authenticate)
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
