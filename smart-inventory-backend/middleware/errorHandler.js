// Middleware for catching 404 (Not Found) routes 

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success : false ,
     message: `Route ${req.originalUrl} Not Found`
     });
};


// Centralized error handler 
const errorHandler = (err, req, res, next) => {
  // Log full error stack on the server console for debugging 
  console.error("Server Error: " , err);
  const statusCode = err.statusCode || 500;
  const meesage = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message: meesage,
  });
};

module.exports = {
    notFoundHandler,
    errorHandler
}