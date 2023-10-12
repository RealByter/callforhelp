
// # imports

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./env") });

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// # constants

const HOSTNAME = "undefined";
const PORT = process.env.PORT || 3080;

//buildFolderPath still not exist
const buildFolderPath = path.join(__dirname, "../client/build");

const helperUsers = [];
const supportedUsers = [];

// # middlewares

app.enable("trust proxy");

app.use(express.json());
app.use(cookieParser());

//set build folder as static
// app.use(express.static(buildFolderPath));

// # routes

//send a unique roomID
app.get("/api/v1/roomID", (req, res) => {
    let roomID = getUniqueId(6);
    console.log("/api/v1/roomID roomID: " + roomID);
    res.send("" + roomID);
});

//every other route will lead to the home page
app.get("*", (_, res) => {
    // res.sendFile(buildFolderPath + "/index.html");
    res.send("<h1>call for help website</h1>")
});


// # socket.io routes

io.on("connection", (socket) => {


    //search for user to help/get supported
    socket.on("search to start chat", (isHelper) => {
        //the user is an helper
        if (isHelper) {
            let socketID = socket.id;

            //check if there is a match
            if (supportedUsers.length > 0) {
                let socketIDToSupport = supportedUsers.shift();
                socket.to(socketIDToSupport).emit("התחלת שיחה מתומך");
                return;
            }

            //else then save the user in the helperUsers
            helperUsers.push(socketID);
        }
        //the user needs help
        else {
            //search for user to get supported by 
            let socketID = socket.id;

            if (helperUsers.length > 0) {
                let socketIDWhichSupport = helperUsers.shift();
                socket.to(socketIDWhichSupport).emit("התחלת שיחה מנתמך");
                return;
            }

            //else then save the user in the supportedUsers
            supportedUsers.push(socketID);
        }
    });

    //remove the user from the necessary queue
    socket.on("stop search to start chat", (isHelper) => {
        //the user is an helper
        if (isHelper) {
            let socketID = socket.id;
            if (helperUsers.includes(socketID)) {
                helperUsers.splice(helperUsers.findIndex(socketID), 1);
            }
        }
        //the user needs help
        else{
            let socketID = socket.id;
            if (supportedUsers.includes(socketID)) {
                supportedUsers.splice(supportedUsers.findIndex(socketID), 1);
            }
        }
    });

    //send message to specific socket
    socket.on("message", (sendTo, message) => {
        socket.to(sendTo).emit(message);
    });

    //TODO: implement
    //one of the users exit the chat
    socket.on("exit chat", (sendTo) => {
    });

    //The function removes the user from the helperUsers queue and supportedUsers if he is in them
    socket.on("disconnecting", () => {
        let socketID = socket.id;
        //remove the user from the helperUsers queue
        if (helperUsers.includes(socketID)) {
            helperUsers.splice(helperUsers.findIndex(socketID), 1);
        }

        //remove the user from the supportedUsers queue
        if (supportedUsers.includes(socketID)) {
            supportedUsers.splice(supportedUsers.findIndex(socketID), 1);
        }
    });
});


//start listen to requests
server.listen(PORT, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});