module.exports = (io, socket) => {
    const searchPartner = (userType) => {
        // TODO: implement function
    }

    const sendMessage = (chatID, message) => {
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