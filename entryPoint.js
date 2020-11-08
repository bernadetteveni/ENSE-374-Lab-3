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
    console.log(req.body.username)
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
        var largestTaskId = null;
        for(var i = 0; i < listOfTasks.length; i++){
            if(listOfTasks[i]._id>largestTaskId){
                largestTaskId = listOfTasks[i]._id;
            }
        }

        res.render("todo", {
        title: "To Do",
        username: username,
        largestTaskId: largestTaskId,
        listOfTasks: listOfTasks
    });
    });
    
});

app.get("/about", (req, res)=>{
    res.render("about")
});

app.get("/logout", (req, res)=>{
    res.redirect("/")
});

app.post("/addtask", (req, res)=>{
    readFile("tasks.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let tasks = JSON.parse(data);
        console.log(req.body.usernameId);
       Task.setLatestId(req.body.largestTaskId);
        tasks.tasks.push(new Task(req.body.taskInput, 
        null, 
        req.body.usernameId, 
        false, 
        false));
        fs.writeFile("./tasks.json", JSON.stringify(tasks, null, 4), (err)=>{
            if(err){
                console.error(err);
                return;
            }
            });
            res.redirect("/todo");
    });
});

app.post("/claim", (req, res)=>{
    readFile("tasks.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let tasks = JSON.parse(data);
        var idToClaim = req.body.id;
        for(var i=0; i<tasks.tasks.length; i++){
            if(tasks.tasks[i]._id == idToClaim){
                tasks.tasks[i].owner = req.body.usernameId;
            }
        }
        fs.writeFile("./tasks.json", JSON.stringify(tasks, null, 4), (err)=>{
            if(err){
                console.error(err);
                return;
            }
            });
            res.redirect("/todo");
    });
});

app.post("/unfinish", (req, res)=>{
    readFile("tasks.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let tasks = JSON.parse(data);
        var idToUnfinish = req.body.id;
        for(var i=0; i<tasks.tasks.length; i++){
            if(tasks.tasks[i]._id == idToUnfinish){
                tasks.tasks[i].done = false;
            }
        }
        fs.writeFile("./tasks.json", JSON.stringify(tasks, null, 4), (err)=>{
            if(err){
                console.error(err);
                return;
            }
            });
            res.redirect("/todo");
    });
});

app.post("/abandonorcomplete", (req, res)=>{
    readFile("tasks.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let tasks = JSON.parse(data);
        var idToUnfinish = req.body.id;
        for(var i=0; i<tasks.tasks.length; i++){
            if(tasks.tasks[i]._id == idToUnfinish){
                if(req.body.checkbox){
                    //complete
                    tasks.tasks[i].done = true;
                }
                else{
                    //abandon
                    tasks.tasks[i].owner = null;
                }
            }
        }
        fs.writeFile("./tasks.json", JSON.stringify(tasks, null, 4), (err)=>{
            if(err){
                console.error(err);
                return;
            }
            });
            res.redirect("/todo");
    });
});

app.post("/purge", (req, res)=>{
    readFile("tasks.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let tasks = JSON.parse(data);
        for(var i=0; i<tasks.tasks.length; i++){
            if(tasks.tasks[i].done){
                tasks.tasks[i].cleared = true;
            }
        }
        fs.writeFile("./tasks.json", JSON.stringify(tasks, null, 4), (err)=>{
            if(err){
                console.error(err);
                return;
            }
            });
            res.redirect("/todo");
    });
    
});
