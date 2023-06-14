const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const { status } = require('express/lib/response');
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});


app.post("/",function(req,res){
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const result = firstName + lastName + email;
    console.log(result);
    const data = {
        members: [
            {
                email_address:email,
                status: "subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/306d29008"; //Mailchimp API endpoint: lists = subscribed lists with audience ID

    const options = { //nodejs options object
        method:"POST",
        auth: "willikoh2:d22be56a338eeb2464739c879ffeed01-us8" //follow the Mailchimp auth rules - name:API key
    }

    const request = https.request(url,options,function(response) {
        response.on("data",function(data){
            console.log(JSON.parse(data)); //show the data that mailchimp sent back to us in console by response method
        })
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData); //send the JSON data to mailchimp server
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/"); //completion handler: trigger by the button with post method and redirect to home route and render the signup.html file again
});

app.listen(3000,function(){
    console.log("server is running on port 3000");
});
//Mailchimp API key
//d22be56a338eeb2464739c879ffeed01-us8

//Audience ID
//c306d29008