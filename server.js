const express = require("express")
const usersRoutes = require('./routes/users')
const employeesRoutes = require("./routes/employees")
const mongoose = require("mongoose")

// const DB_CONNECTION_STRING = "mongodb://localhost:27017/books"
const DB_CONNECTION_STRING = "mongodb+srv://kodexbaba41:Ea4312016085*@cluster0.o7wsr.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.log("Error: ", err)
})

const app = express()

const SERVER_PORT = 3001

app.use(express.json())
app.use(express.urlencoded())

app.use("/api/v1", usersRoutes)
app.use("/api/v1/emp", employeesRoutes)

app.route("/")
    .get((req, res) => {
        res.send("<h1>MongoDB + Mongoose Example</h1>")
    })

app.listen(SERVER_PORT, () =>{
    console.log(`Server running at http://localhost:${SERVER_PORT}/`)
})