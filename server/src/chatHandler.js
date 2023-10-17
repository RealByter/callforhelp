// # imports
const { v4: uuidv4 } = require("uuid");

// get unique id of given length
function getUniqueId(length) {
    let id = uuidv4();
    return id.substring(0, Math.min(length, id.length));
}

//get the current date in israel (you can't use just new Date()
//because it will get the date of the location where the server is located) 
function getCurrDateIsrael() {

    let here = new Date();

    // suppose the date is 12:00 UTC
    let invdate = new Date(here.toLocaleString('en-US', { timeZone: "Israel" }));

    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    let diff = here.getTime() - invdate.getTime();

    return new Date(here.getTime() - diff);
}

let supportersQueue = [];
let supportedQueue = [];

module.exports = (io, socket) => {

    const searchPartner = (userType) => {
        if (userType === "supporter") {
            //check if there users to support
            if (supportedQueue.length > 0) {
                //add the supporter and the supported to a room
                let chatID = getUniqueId(6);
                socket.join(chatID);
                let supportedSocket = supportedQueue.shift()
                supportedSocket.join(chatID);

                //send "start chat" message to all of the users in the chat
                io.to(chatID).emit("start chat", chatID);
            }

            //there is no users currently to support
            //wait in the queue to support
            supportersQueue.push(socket);
        }
        //userType is supported
        else {
            //check if there users to get supported by
            if (supportersQueue.length > 0) {
                //add the supporter and the supported to a room
                let chatID = getUniqueId(6);
                socket.join(chatID);
                let supporterSocket = supportersQueue.shift()
                supporterSocket.join(chatID);

                //send "start chat" message to all of the users in the chat
                io.to(chatID).emit("start chat", chatID);
            }

            //there is no users currently to get supported by
            //wait in the queue to get supported
            supportedQueue.push(socket);
        }
    }

    const sendMessage = (chatID, message, callback) => {
        let messageID = getUniqueId(6);
        
        let messageDate = getCurrDateIsrael();
        let messageDateISOString = messageDate.toISOString();

        //TODO: save message to the Database

        //send the message to the other user in the chat
        socket.to(chatID).emit("get message", chatID, messageID, message, messageDateISOString)

        //call to callback with the necessary parameters
        callback(messageID, messageDateISOString);
    }

    const stopChat = (chatID) => {
        //tell the other user in the chat to close the chat
        socket.to(chatID).emit("close chat", chatID);
    }

    const blockChat = (chatID) => {
        // TODO: implement function
    }

    const disconnecting = () => {
        //check if the socket is in one of the queues
        //if so then remove him
        for(let i = 0; i < supportersQueue.length; i++){
            if(supportersQueue[i].id === socket.id){
                supportersQueue.splice(i, 1);
                break;
            }
        }

        for(let i = 0; i < supportedQueue.length; i++){
            if(supportedQueue[i].id === socket.id){
                supportedQueue.splice(i, 1);
                break;
            }
        }
    }

    socket.on("search partner", searchPartner);
    socket.on("send message", sendMessage);
    socket.on("stop chat", stopChat);
    socket.on("block chat", blockChat);
    socket.on("disconnecting", disconnecting);
}