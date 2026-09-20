 const express  = require("express");

const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const saleRoutes = require("./routes/saleRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stockRoutes = require("./routes/stockRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const reportRoutes = require("./routes/reportRoutes");
const {notFoundHandler , errorHandler} = require("./middleware/errorHandler");

const app = express();

// Cors middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Base routes 
app.use("/api" , healthRoutes);
app.use("/api/auth", authRoutes);  
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/reports", reportRoutes);


// Error handling middleware (must be registered last )

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
