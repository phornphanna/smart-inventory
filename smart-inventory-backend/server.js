require("dotenv").config();

const app = require("./app");
const db = require("./config/db");
require("./jobs/dailySweep");

const PORT = process.env.PORT || 5001;

const startServer = async () =>{
       try {
          // Test database connection before launching server 
          const connection  = await db.getConnection();
          console.log("MySql connection pool established successfully!");
          connection.release();
          
          app.listen(PORT , () =>{
               console.log(`Server running on port ${PORT}`);
          });
       }catch(error){
          console.error("Failed to connect to MYSQL database :  " , error.message);
          process.exit(1)
       }
};

startServer();