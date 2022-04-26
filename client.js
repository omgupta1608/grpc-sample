const grpc = require("grpc"),
  protoLoader = require("@grpc/proto-loader");

// load the proto file
var protoDef = protoLoader.loadSync("employee.proto", {});

// extract package from the schema
const employeePackage = grpc.loadPackageDefinition(protoDef).employeePackage;
// extract service from the package
const EmployeeService = employeePackage.EmployeeService;

// connect client to the server via the host and port
const client = new EmployeeService(
  "127.0.0.1:50000",
  grpc.credentials.createInsecure()
);

// call the methods directly from the client object
client.createEmployee(
  {
    name: "Om",
    designation: "Software Engineer",
    salary: 1000,
  },
  (err, response) => {
    console.log(JSON.stringify(response));
  }
);

client.getEmployees({}, (err, response) => {
  console.log(JSON.stringify(response));
});

// returns a stream object which has events to listen to like 'on' or 'end'
const stream = client.getEmployeesStream({});

stream.on('data', (data) => {
    console.log(JSON.stringify(data));
});

stream.on('end', (e) => console.log('Server Streaming done'))