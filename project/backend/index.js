// This is the start of a backend server. We will write server side code here

//this is a node package that will help us create a server
const express = require("express")

//this is the main app. Apps can get complicated. For now, think of it as a place to store server
//side methods.  We will access server side methods via routes, which 
//are URLs (like http://localhost:8000/number or http://yorku.ca/somename)
const app = express()

//this is the networking port we are going to listen on. 
//Backend programs listen on networking ports to get information from other computers
const PORT = 8000

function genRandomNum(max) {
    var randNum = Math.floor(Math.random() * max) + 1;
    return randNum;
}

//var secretNum = genRandomNum(maxRange);

var maxRange = 1;
var attempts = 0;
var winStreak = 0;
var hintsAllowed = 0;
var score = 0;


app.get('/range', (req, res) => {

    console.log("The input values to this method are:")
    for (const [key, value] of Object.entries(req.query)) {
        console.log(key, value);
    } 

    console.log("The input values to this method are:")
    
    var max = parseInt(req.query["range"]);
    var diffLevel = "";

    if (max <= 10) {
        diffLevel = "Easy Difficulty";
        hintsAllowed = 0;
    } else if (max <= 30) {
        diffLevel = "Medium Difficulty";
        hintsAllowed = 1;
    } else if (max <= 60) {
        diffLevel = "Hard Difficulty";
        hintsAllowed = 2;
    } else {
        diffLevel = "Impossible Difficulty";
        hintsAllowed = 3;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    maxRange = max;
    //res.send('Range has been set.');
    console.log("Range has been set.");

    secretNum = genRandomNum(max);

   res.json({
        Range: "has been set!",
        Difficulty: diffLevel
    })

   /*  output1: diffLevel,
    output2: "Range has been set!" */

})

/**
 * The route below is '/number'. Routes help the computer understand what resources or results
 * the user is trying to access. Our front end can access this route by directing a request to
 * http://localhost:8000/number.  The route is therefore like the name of a method.
 */
app.get('/guess', (req, res) => {

    console.log("The input values to this method are:")
    for (const [key, value] of Object.entries(req.query)) {
        console.log(key, value);
    } 

    var guess = parseInt(req.query["guess"]);
    var result = "";
    

    if (guess > maxRange) {
        result = "Guess is out of range!"
    } else {
        if (guess == secretNum) {
            result = "Correct! Set new range to play again!";
            winStreak++;
            score++;
        } else {
            result = "Wrong :("
            attempts++;
            winStreak = 0;
        }
    }
    
    console.log("Guess is: " + maxRange);    
    console.log("Secret num is: " + secretNum);

    console.log("Sending some num values to the front end.");
    res.setHeader("Access-Control-Allow-Origin", "*"); //Allows browser to load return values
    res.json({
        Attempt: attempts,
        Win: "Streak " + winStreak,
        Result: result,
        Score: score,
    })
})

app.get('/hints', (req, res) => {

    console.log("The input values to this method are:")
    for (const [key, value] of Object.entries(req.query)) {
        console.log(key, value);
    } 
    var hintMax = 0;
    var hintMin = 0; 
    var hintResult = "";

    if (hintsAllowed == 3) {
        hintMax = secretNum + Math.floor(Math.random() * 20) + 1;
        if (hintMax > maxRange) {
            hintMax = maxRange
        } else {
            hintMax = hintMax;
        }
        hintMin = secretNum - Math.floor(Math.random() * 20) + 1;
        if (hintMin < 1) {
            hintMin = 1
        } else {
            hintMin = hintMin;
        }
        hintsAllowed--;
        hintResult = "Number is between " + hintMin + " and " + hintMax;

    } else if (hintsAllowed == 2) {
        hintMax = secretNum + Math.floor(Math.random() * 10) + 1;
        if (hintMax > maxRange) {
            hintMax = maxRange
        } else {
            hintMax = hintMax;
        }
        hintMin = secretNum - Math.floor(Math.random() * 10) + 1;
        if (hintMin < 1) {
            hintMin = 1
        } else {
            hintMin = hintMin;
        }
        hintsAllowed--;
        hintResult = "Number is between " + hintMin + " and " + hintMax;
    } else if (hintsAllowed == 1) {
        hintMax = secretNum + Math.floor(Math.random() * 5) + 1;
        if (hintMax > maxRange) {
            hintMax = maxRange
        } else {
            hintMax = hintMax;
        }
        hintMin = secretNum - Math.floor(Math.random() * 5) + 1;
        if (hintMin < 1) {
            hintMin = 1;
        } else {
            hintMin = hintMin;
        }
        hintsAllowed--;
        hintResult = "Number is between " + hintMin + " and " + hintMax;
    } else {
        hintResult = "No hint allowed";
    }

    
    console.log("Hint is: " + hintResult);    
    //console.log("Secret num is: " + secretNum);

    //console.log("Sending some num values to the front end.");
    res.setHeader("Access-Control-Allow-Origin", "*"); //Allows browser to load return values
    res.json({
        Hint: hintResult,
        Hints: hintsAllowed + " Left"
    })
})

app.get('/giveUp', (req, res) => {

    console.log("The input values to this method are:")
    for (const [key, value] of Object.entries(req.query)) {
        console.log(key, value);
    } 
    
    winStreak = 0;

    res.setHeader("Access-Control-Allow-Origin", "*"); //Allows browser to load return values
    res.json({
        Number: secretNum,
        Result: "You gave up!",
        Message: "Set new range and play again!"
    })
})


/**
 * Servers listen for interactions and requests.
 * Our app sits and waits for requests to come in.
 * These requests can be from browsers, or other 
 * computers in the cloud.  Could be your smartwatch?
 * Your fridge, your robot dog?
 */
app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`)
})
