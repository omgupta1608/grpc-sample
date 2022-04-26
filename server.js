const grpc = require("grpc"),
  protoLoader = require("@grpc/proto-loader");

// load the proto file
var protoDef = protoLoader.loadSync("employee.proto", {});

// extract package from the schema
const employeePackage = grpc.loadPackageDefinition(protoDef).employeePackage;
// extract service from the package
const EmployeeService = employeePackage.EmployeeService;

// set up gRPC server with the host and port
const server = new grpc.Server();
server.bind("127.0.0.1:50000", grpc.ServerCredentials.createInsecure());

// in memory (for sample) - can use db
let employees = [];

// define functions
const getEmployees = (call, cb) => {
  cb(null, { employees });
};

const createEmployee = (call, cb) => {
  const empItem = {
    id: employees.length + 1,
    name: call.request.name,
    designation: call.request.designation,
    salary: call.request.salary,
  };

  employees.push(empItem);

  cb(null, empItem);
};

const getEmployeesStream = (call, cb) => {
    employees.forEach(emp => call.write(emp));
    call.end();
}

// add a new service to the server while mapping the methods in the schema to the actual handler functions
server.addService(EmployeeService.service, {
  getEmployees: getEmployees,
  createEmployee: createEmployee,
  getEmployeesStream: getEmployeesStream
});

// start the server (listen)
server.start();
