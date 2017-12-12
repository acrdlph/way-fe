let currentConnection = null;
let messageHandler = null;
let connectionCloseHandler = null;
let connectionSuccessHandler = null;
let userId = null;

export const initWebSocketStore = (newUserId, newMessageHandler, 
    newConnectionSuccessHandler, newConnectionCloseHandler) => {
    userId = newUserId;
    messageHandler = newMessageHandler || (() => {throw new Error('Message handle required');})();
    connectionCloseHandler = newConnectionCloseHandler || (() => {});
    connectionSuccessHandler = newConnectionSuccessHandler || (() => {});
    newConnection();
};

export const getWebSocketConnection = async function getWebSocketConnection() {
    if (!userId && !messageHandler) {
        console.log('call initStore first');
        return;
    }
    if (currentConnection && currentConnection.readyState === currentConnection.OPEN) {
        return currentConnection;
    } else {
        return newConnection();
    }
};

const newConnection = async function newConnection() {
    let connection = new WebSocket(WEBSOCKET_BASE_URL + userId);
    addClosehandler(connection);
    connection.onmessage = messageHandler;
    currentConnection = await connectionPromise(connection);
    connectionSuccessHandler();
    return connection;
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

