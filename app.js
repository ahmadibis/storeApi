const express = require('express')
const app = express()



const notFoundMiddleWare = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")

//the express async error package allows us to not have to write a try catch everytime or having to create our own 
// wrapper as it will wrap and do the work for us so we can throw new Error("testing error") so we are catching the error this way , we can confirm in our error handler middleware
require("express-async-errors")
require('dotenv').config()

const connectDB = require("../starter/db/connect")

const productRouter = require("./routes/products")

app.use(express.json())

//routes
app.use("/api/v1/products", productRouter);

app.use(notFoundMiddleWare)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const startDB = async () => {
    try {
           await connectDB(process.env.MONGO_URI);
           app.listen(port, () => {
             console.log(`server started listening on port ${port}`);
           });
    } catch (error) {
        console.log(error);
    }
 
}

startDB()

