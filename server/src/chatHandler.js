// # imports
const { v4: uuidv4 } = require("uuid");

// get unique id of given length
function getUniqueId(length) {
    let id = uuidv4();
    return id.substring(0, Math.min(length, id.length));
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
        // TODO: implement function
    }

    const stopChat = (chatID) => {
        // TODO: implement function
    }

    const blockChat = (chatID) => {
        // TODO: implement function
    }

    socket.on("search partner", searchPartner);
    socket.on("send message", sendMessage);
    socket.on("stop chat", stopChat);
    socket.on("block chat", blockChat);
}