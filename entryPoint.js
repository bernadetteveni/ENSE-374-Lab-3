const express = require("express");
const bodyParser = require('body-parser');
const { static } = require("express");

const app = express();
const port = 3000;
app.listen(port, ()=>{
    console.log("Server is running on port" + port)
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

function homepage(req, res){
    res.sendFile(`${process.cwd()}/public/index.html`);
}
app.get("/", homepage);
app.post("/", (req, res)=>{
    // res.redirect("/about")
    console.log(req.body.email)
    res.send("<h1>Message Received</h1>")
});

app.get("/about", (req, res)=>{
    res.send("<h1>This is about page</h11>")
});