const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

// Init DB
require('../services/db')

const controller = require('./controller')
const config = require('../configs')

const { SERVER_HOST: host, SERVER_PORT: port } = config.env
const url = `${host}:${port}`

// Load proto
const PROTO_PATH = path.join(__dirname, '../proto/user.proto')
const packageConfig = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}
const packageDefinition = protoLoader.loadSync(PROTO_PATH, packageConfig)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).users

// Initiate Server
const server = new grpc.Server()
server.addService(protoDescriptor.UsersService.service, controller)
server.bindAsync(url, grpc.ServerCredentials.createInsecure(), (err) => {
  if(err) {
    console.log('>>>> gRPC Server Error: ', err)
    process.exit()
  }
  server.start()
  console.log('>>>> gRPC Server is running on:', url)
})
