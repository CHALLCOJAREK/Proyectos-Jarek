CREATE TABLE Clientes (
  ClienteID INT PRIMARY KEY,
  Nombre VARCHAR(50),
  Apellido VARCHAR(50),
  Email VARCHAR(100),
  Telefono VARCHAR(15),
  Direccion VARCHAR(100),
  FechaRegistro DATE,
  Estado VARCHAR(20)
);

CREATE TABLE Productos (
  ProductoID INT PRIMARY KEY,
  NombreProducto VARCHAR(100),
  Descripcion VARCHAR(255),
  PrecioUnitario DECIMAL(10,2),
  Stock INT,
  CategoriaID INT,
  Estado VARCHAR(20)
);

CREATE TABLE Empleados (
  EmpleadoID INT PRIMARY KEY,
  Nombre VARCHAR(50),
  Apellido VARCHAR(50),
  Cargo VARCHAR(50),
  Email VARCHAR(100),
  Telefono VARCHAR(15),
  FechaContratacion DATE,
  Estado VARCHAR(20)
);

CREATE TABLE Ventas (
  VentaID INT PRIMARY KEY,
  ClienteID INT,
  EmpleadoID INT,
  FechaVenta DATE,
  TotalVenta DECIMAL(10,2),
  MetodoPago VARCHAR(50),
  Estado VARCHAR(20),
  FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID),
  FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID)
);

CREATE TABLE Detalles_Venta (
  DetalleID INT PRIMARY KEY,
  VentaID INT,
  ProductoID INT,
  Cantidad INT,
  PrecioUnitario DECIMAL(10,2),
  Subtotal DECIMAL(10,2),
  FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
  FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);
