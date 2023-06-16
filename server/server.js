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
const target_grpc = '0.0.0.0:50051';


function authenticate(call, callback) {
    var authenticated = '[Deny]';
    if ((call.request.user == 'Admin') && (call.request.password == '123456789')){
      callback(null, {authenticated: true});
      authenticated = '[Allow]';
    }
    else{
      callback(null, {authenticated: false});
    }
    console.log('Authenticated: ' + call.request.user + '=>' + authenticated);
}

function main() {
  var server = new grpc.Server();
  server.addService(auth_proto.Authenticator.service, {authenticate: authenticate});
  console.log("Running gRPC on " + target_grpc);
  server.bindAsync(target_grpc, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
