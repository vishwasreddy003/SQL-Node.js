const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "MERN",
    password: "sql@123",
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

app.get("/", (req, res) => {
    let q = "SELECT count(*) FROM users";

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("Error in DATABASE");
    }
});

app.get("/user", (req, res) => {
    let q = "SELECT id,username,email FROM users";

    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            //console.log(users);
            res.render("showusers.ejs",{users});
        });
    } catch (err) {
        console.log(err);
        res.send("Error in DATABASE");
    }
    
});

app.get("/user/:id/edit", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM users where id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            res.render("edit.ejs",{user});
        });
    } catch (err) {
        console.log(err);
        res.send("Error in DATABASE");
    }
});

app.patch("/user/:id", (req,res) => {
    let {id} = req.params;
    let {password : userpass, username : newusername} = req.body;
    let q = `SELECT * FROM users where id = '${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            if(userpass != user.password){
                res.send("ERROR!, Wrong Password");
            }else{
                let q2 = `UPDATE users SET username ='${newusername}' WHERE id ='${id}'`;
                connection.query(q2,(err,result) => {
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Error in DATABASE");
    }

});

app.get("/user/new", (req,res) => {
    
    try {
        res.render("Addnew.ejs");
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
    
});

app.post("/user/new", (req,res) => {
    let {email,username,password} = req.body;
    let id = faker.string.uuid();

    let q = `INSERT INTO users (id,username,email,password) VALUES ('${id}', '${username}','${email}', '${password}')`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        res.send("Error in DATABASE");
    }
});

app.get("/user/:id/delete", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM users where id = '${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            res.render("deleteuser.ejs", {user});
        });
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
});

app.delete("/user/:id", (req,res) => {
    let {id} = req.params;
    let {password : userpass} = req.body;

    let q = `SELECT * FROM users WHERE id = '${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            if(userpass != user.password){
                res.send("ERROR!, Wrong Password");
            }else{
                let q2 = `DELETE FROM users  WHERE id ='${id}'`;
                connection.query(q2,(err,result) => {
                    if(err) throw err;
                    console.log("Deleted!");
                    res.redirect('/user');
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Error in DATABASE");
    }

});


app.listen("3300", () => {
    console.log("server is listening on port 3300");
});

// let q = "INSERT INTO users (id,username,email,password) VALUES ?";

// let data = [];

// for(let i = 1; i <= 100; i++){
//     data.push(getRandomUser());
// }
