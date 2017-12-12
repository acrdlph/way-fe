// move to local storage
const delayedMessages = [];

let currentConnection = null;
let messageHandler = null;
let connectionCloseHandler = null;
let connectionSuccessHandler = null;
let userId = null;
let intialized = false;

export const initWebSocketStore = (newUserId, newMessageHandler, 
    newConnectionSuccessHandler, newConnectionCloseHandler) => {
    messageHandler = newMessageHandler || (() => {throw new Error('Message handle required');})();
    connectionCloseHandler = newConnectionCloseHandler || (() => {});
    connectionSuccessHandler = newConnectionSuccessHandler || (() => {});
    if (!intialized && !isConnected()) {
        userId = newUserId;
        newConnection();
        intialized = true;
    }
};

export const send = async function send(msg) {
    if (!userId && !messageHandler) {
        throw new Error('call initStore first');
    }
    const payloadString = JSON.stringify(msg);
    const result = await managedSend(payloadString); 
    console.log("send message: " + payloadString);
    return result;
}

const managedSend = async function managedSend(msg) {
    if (isConnected()) {
        currentConnection.send(msg);
        return true;
    } else {
        // connection issue, store messages locally
        delayedMessages.push(msg);
        newConnection();
        return false;
    }
};

const isConnected = function isConnected() {
    return currentConnection && currentConnection.readyState === currentConnection.OPEN 
            && navigator.onLine;
}

const newConnection = async function newConnection() {
    let connection = new WebSocket(WEBSOCKET_BASE_URL + userId);
    addClosehandler(connection);
    connection.onmessage = messageHandler;
    currentConnection = await connectionPromise(connection);
    // send previously delayed messages after a small delay
    setTimeout(() => {
        sendDelayedMessages();
        connectionSuccessHandler();
    }, 500);
    return connection;
} 

function sendDelayedMessages() {
    while (delayedMessages.length && isConnected()) {
        currentConnection.send(delayedMessages.shift());
    }
}

const connectionPromise = function connectionPromise(connection) {
    return new Promise((resolve, reject) => {
        connection.onopen = () => {
            resolve(connection);
        };
    });
}

const addClosehandler = function addClosehandler(connection) {
    connection.onclose = (evt) => {
        console.log('web socket connection closed ', evt);
        currentConnection = null;
        connectionCloseHandler();
        setTimeout(newConnection, 1000); // try to reconnect after 1 second     
    };
} 

