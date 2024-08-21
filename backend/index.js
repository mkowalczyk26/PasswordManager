const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const {encrypt, decrypt} = require('./handleEncryption')
const hashPassword = require('./handleHash')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const app = express()
app.use(cors())
app.use(express.json())



const con = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "",
    multipleStatements: true
})

var key = ''

const getKey = (callback) => {
    con.query("SELECT encKey FROM enc", (error, result) => {
        if (error) {
            console.error("Error fetching encryption key:", error);
            callback(error);
        } else {
            if (result.length > 0 && result[0].encKey) {
                key = result[0].encKey;
                console.log("Encryption key fetched");
                callback(null, key);
            } else {
                key = crypto.randomBytes(32).toString('base64');
                con.query("INSERT INTO enc (encKey) VALUES (?)", [key], (error, result) => {
                    if (error) {
                        console.error("Error inserting encryption key:", error);
                        callback(error);
                    } else {
                        console.log("New encryption key inserted");
                        callback(null, key);
                    }
                });
            }
        }
    });
};

app.post("/", (req, res) => {
    const {service, password} = req.body;
    const encrypted = encrypt(password, key)
    con.query(`INSERT INTO data (service, password, iv) VALUES (?,?,?)`,[service, encrypted.encrypted, encrypted.iv] ,(erro, result) => {
        if (erro) {
            console.log(erro)
        } else {
            res.json({result: "success"})
        }
    })
})

app.post("/setmaster", async (req, res) => {
    const {password} = req.body;
    const hashed = await hashPassword(password)
    con.query("INSERT INTO master (password) VALUES (?)", [hashed], (error, result) => {
        if (error) {
            console.log(error)
        } else {
            res.json({result: "success"})
        }
    })
})

app.post("/changemaster", async (req, res) => {
    const {newPassword} = req.body;
    const hashed = await hashPassword(newPassword)
    con.query("UPDATE master SET password = ?", [hashed], (error, result) => {
        if (error) {
            console.log(error)
        } else {
            res.json({result: "success"})
        }
    })
})

app.get("/get", (req, res) => {
    con.query("SELECT * FROM data", (error, result) => {
        if(error){
            console.log(error)
        } else {
        res.send(result)
        }
    })

})

app.get("/getmaster", (req, res) => {
    con.query("SELECT * FROM master", (error, result) => {
        if (error) {
            console.log(error)
        } else {
            if (result.length > 0) {
                res.send(true)
            } else {
                res.send(false)
            }
        }
    })
})

app.post("/checkmaster", async (req, res) => {
    const {input: masterInput} = req.body

    con.query("SELECT password FROM master", async (error, result) => {
        if (error) {
            console.log(error)
        } else {
            if (result.length > 0) {
                const match = await bcrypt.compare(masterInput, result[0].password)
                res.send({match: match})
            }
        }
    })
})


app.post("/decrypt", (req, res) => {
    res.send(decrypt(req.body, key))
})

const startServer = () => {
    getKey((error) => {
        if (error) {
            console.error("Error starting server:", error);
        } else {
            app.listen(3005, () => {
                console.log("Server started");
            });
        }
    });
};

startServer()
