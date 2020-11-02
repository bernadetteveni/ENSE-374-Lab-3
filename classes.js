// const User = require('./User.js').default;
// const Task = require('./Task.js').default;

import User from './User.js'
import Task from './Task.js'
import fs from "fs"; 

function main(){
    var user1 = new User("username1", "password1");
    var user2 = new User("username2", "password2");
    var users = [user1, user2];
    console.log(users[0].username); 
    console.log(users.length);

    var usersObj = {
        users: []
    }
    usersObj.users = users;


    fs.writeFile("./users.json", JSON.stringify(usersObj, null, 4), (err)=>{
        if(err){
            console.error(err);
            return;
        }
    });

    var task1 = new Task(
        "1 unclaimed task", 
        null, 
        "creator1", 
        false, 
        false);

    console.log(task1._id);

    var task2 = new Task(
        "1 claimed by user1 and unfinished",
        "user1", 
        "creator2", 
        false, 
        false);

    var task3 = new Task(
        "1 claimed by user2 and unfinished",
        "user2", 
        "creator3", 
        false, 
        false);

    var task4 = new Task(
        "1 claimed by user1 and finished",
        "user1", 
        "creator4", 
        true, 
        false);
    
    var task5 = new Task(
        "1 claimed by user2 and finished",
        "user2", 
        "creator5", 
        true, 
        false);

    var tasks = [task1, task2, task3, task4, task5];
    var tasksObj = {
        tasks: []
    }
    tasksObj.tasks = tasks;

    fs.writeFile("./tasks.json", JSON.stringify(tasksObj, null, 4), (err)=>{
        if(err){
            console.error(err);
            return;
        }
    });

    console.log(JSON.stringify(users, null, 4));
    console.log(JSON.stringify(tasks, null, 4));
    console.log("parsing the JSON");
    tasks = null;
    users = null;

    fs.readFile("users.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let info = JSON.parse(data);
        console.log(info);
        tasks = info;
    });

    fs.readFile("tasks.json", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let info = JSON.parse(data);
        console.log(info);
        tasks = info;
    });

}


main();