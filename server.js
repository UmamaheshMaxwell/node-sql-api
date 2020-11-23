const express = require("express");
const sql = require("mssql")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express();
const router = express.Router();


const dbConfig = {
    user: 'username',
    password: 'password',
    server: 'server',
    database: 'StudentDB'
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

router.get("/", (req, res) =>{
    res.json({message : "Welcome to Node SQL Server API"})
})

router.get("/student", (req, res)=>{
    sql.connect(dbConfig, (err)=>{
        if(err){
            throw err;
        }

        //create request object
        const request = new sql.Request();
        const selectQuery = "Select top 10 * from Student";

        request.query(selectQuery, (err, data) => {
            if(err){
                throw err;
            }
            res.json(data.recordset)
        })
    })
})

router.get("/student/:id", (req, res)=>{
    var studentId = req.params.id
    sql.connect(dbConfig, (err)=>{
        if(err){
            throw err;
        }

        //create request object
        const request = new sql.Request();
        const selectQuery = `Select top 1 * from Student where id=${studentId}`;

        request.query(selectQuery, (err, data) => {
            if(err){
                throw err;
            }
            res.json(data.recordset)
        })
    })
})

router.post("/student", (req, res)=>{
    var body = req.body;
    console.log('body', body)
    sql.connect(dbConfig, (err)=>{
        if(err){
            throw err;
        }
        //create request object
        const request = new sql.Request();

        const insertQuery = `INSERT INTO Student VALUES ('${body.name}', '${body.city}' , ${body.age})`

        request.query(insertQuery, (err, data)=>{
            if(err){
                throw err;
            }
            res.json(data)
        })

    })

})

router.put("/student/:id", (req, res) => {
    var body = req.body;
    var studentId = req.params.id

    sql.connect(dbConfig, (err)=>{
        if(err){
            throw err;
        }

        //create request object
        const request = new sql.Request();

        const updateQuery =`UPDATE Student SET name = '${body.name}', city='${body.city}', age= ${body.age} Where id = ${studentId}`

        request.query(updateQuery, (err, data)=>{
            if(err){
                throw err;
            }

            res.json(data)
        })
    })
})

router.delete("/student/:id", (req, res) =>{
    var studentId = req.params.id;

    sql.connect(dbConfig, (err)=>{
        if(err){
            throw err;
        }

        
        //create request object
        const request = new sql.Request();

        const deleteQuery= `Delete from Student Where id=${studentId}`

        request.query(deleteQuery, (err, data) => {
            if(err){
                throw err;
            }

            res.json(data)
        })

    })
})

const PORT = 3000;

app.use("/api", router)

app.listen(PORT, () =>{
    console.log(`Server listening at PORT ${PORT}`)
})