var PROTO_PATH = __dirname + '/auth.proto';

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
function authenticate(call, callback) {
  callback(null, {authenticated: true});
  console.log("Authenticated: " + call.request.user);
}

function main() {
  var server = new grpc.Server();
  server.addService(auth_proto.Authenticator.service, {authenticate: authenticate});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
