const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const config = require('../configs')

const { SERVER_HOST: host, SERVER_PORT: port } = config.env
const url = `${host}:${port}`

const PROTO_PATH = path.join(__dirname, '../proto/user.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).users

const client = new protoDescriptor.UsersService(url, grpc.credentials.createInsecure())
console.log('>>>> gRPC Client is running on:', url)

client.Health({}, (error, response) => {
  if(error) console.log('Error on health check: ', error)
  console.log(response)
})
