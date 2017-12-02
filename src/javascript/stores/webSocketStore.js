let currentConnection = null;
let messageHandler = null;
let userId = null;

export const initWebSocketStore = (newUserId, newMessageHandler) => {
    userId = newUserId;
    messageHandler = newMessageHandler;
};

export const getWebSocketConnection = () => {
    if (!userId && !messageHandler) {
        console.log('call initStore first');
        return;
    }
    if (currentConnection) {
        return currentConnection;
    } else {
        return newConnection();
    }
};

const newConnection = async function newConnection() {
    let connection = new WebSocket(WEBSOCKET_BASE_URL + userId);
    addClosehandler(connection);
    currentConnection = await connectionPromise(connection);
    currentConnection.onmessage(messageHandler);
    return connection;
} 

const connectionPromise = function connectionPromise(connection) {
    return new Promise((resolve, reject) => {
        connection.onopen(() => {
            resolve(connection);
        });
    });
}

const addClosehandler = function addClosehandler(connection) {
    connection.onclose((evt) => {
        console.log('web socket connection closed ', evt);
        currentConnection = null;
    });
} 

