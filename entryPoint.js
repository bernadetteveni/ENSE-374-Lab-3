import express from "express";
import { urlencoded } from 'body-parser';
import ejs from "ejs";
import fs, {readFile} from "fs";
import User from './User.js';
import Task from './Task.js';

const app = express();
const port = 3000;
app.listen(port, ()=>{
    console.log("Server is running on port" + port)
})

app.set('view engine', 'ejs');

app.use(urlencoded({extended:true}));
app.use(express.static("public", {index: false}))

function homepage(req, res){
    // res.sendFile(`${process.cwd()}/public/login.html`);
    res.render("index", {
        myVariable: "myVariable"
    });
}

app.get("/", homepage);
app.post("/", (req, res)=>{
    // res.redirect("/about")
    console.log(req.body.email)
    res.send("<h1>Message Received</h1>")
});

app.post("/login", (req, res)=>{
    // check through the user list to see if the entered username is registered
    const username = req.body.username;
    const password = req.body.password;
    var userFound = false;

    readFile("users.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let users = JSON.parse(data);

        for(var i = 0; i < users.users.length; i++){
            // if so, check if the user's password matches the password for the entry 
            if(users.users[i].username === username &&
                users.users[i].password === password){
                    console.log("User found ", username, " ", password);
                    userFound = true;
                    // if so, redirect the user with the POST variables to the "/todo" route.
                    res.redirect("/todo")
            }
        }
        if(!userFound){
            console.error("User not found");
        }
    });
});

app.post("/register", (req, res)=>{
    // ensure that the sign up authorization matches a constant value you have in your script 
    const hardcodedUsername = "bob";
    const hardcodedPassword = "pass";
    const userUsername = req.body.regUsername;
    const userPassword = req.body.regPassword;
    var matchesHardcoded = true;

    if(hardcodedUsername !== userUsername ||
        hardcodedPassword !== userPassword){
            matchesHardcoded = false; //don't register if not matching
    }

    // check that no users exists with the username entered
    var userFound = false;

    readFile("users.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let users = JSON.parse(data);

        for(var i = 0; i < users.users.length; i++){
            if(users.users[i].username === userUsername){
                    userFound = true;
            }
            else{
                console.log("User not found");
            }
        }
        if(!userFound && matchesHardcoded){
            // If not, create a new user with the username and password supplied
            users.users.push(new User(userUsername, userPassword));
            fs.writeFile("./users.json", JSON.stringify(users, null, 4), (err)=>{
                if(err){
                    console.error(err);
                    return;
                }
            });
            // finally, redirect with the POST variables to the "/todo" route.
            res.redirect("/todo");
        }
        else {
            res.send("<h1>User doesn't match hardcoded values or already exists</h1>");
        }
    });
})

app.get("/todo", (req, res)=>{
    var username = "user1";
    readFile("tasks.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        var listOfTasks = JSON.parse(data).tasks;
        console.log("list: ", listOfTasks);
        res.render("todo", {
        title: "To Do",
        username: username,
        listOfTasks: listOfTasks
    });
    });
    
});

app.get("/about", (req, res)=>{
    // res.send("<h1>This is about page</h1>")
    res.render("about")
});