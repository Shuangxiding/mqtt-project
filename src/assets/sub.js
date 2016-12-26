
// 引用paho-mqtt的javascript代码
// document.write("<script language=\"javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.js\"></script>");


var iotClient;

// 创建IoT客户端并连接到IoT实例（服务端）
function connectToIot() {
    // 创建IoT Client
    host = "031.mqtt.iot.gz.baidubce.com";  // 设置IoT实例的连接地址
    port = 8884;

    clientId = String(Math.random()).substring(2);
    iotClient = new Paho.MQTT.Client(host, port, clientId);
    iotClient.onMessageArrived = onMessageArrived;
    iotClient.onConnectionLost = onConnectionLost;

    // 连接到IoT实例
    username = "031/028";  // 设置用户名
    password = "qBXdxl+/DOANe0dpwb2eXaJ13FwOPDChHcPavxOY+4I=";  // 设置密码

    connectOptions = {
        invocationContext: {
            host: host,
            port: port
        },

        userName: username,
        password: password,

        timeout: 30,
        keepAliveInterval: 60,
        cleanSession: true,
        useSSL: true,

        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure
    };
    iotClient.connect(connectOptions);
}

// 订阅主题
function subscribe() {
    topic = "028";  // 设置订阅的主题
    qos = 0;  // 设置订阅时的QoS（默认为0）
    options = {
        invocationContext: {
            topic: topic,
            qos: qos
        },

        onSuccess: onSubscribeSuccess,
        onFailure: onSubscribeFailure
    };
    iotClient.subscribe(topic, options);
}

// 取消订阅的主题
function unsubscribe() {
    topic = "028";  // 设置取消订阅的主题
    options = {
        invocationContext: {
            topic: topic
        },

        onSuccess: onUnsubscribeSuccess,
        onFailure: onUnsubscribeFailure
    };
    iotClient.unsubscribe(topic, options);
}

// 与IoT实例（服务端）断开连接
function disconnect() {
    iotClient.disconnect();
}

// 当IoT客户端成功连接到IoT实例（服务端）时，该函数被调用。
function onConnectSuccess(connectedOptions) {
    host = connectedOptions.invocationContext.host;
    port = connectedOptions.invocationContext.port;
    console.log("connected to " + host + ":" + port + " successfully");
    subscribe();
}

// 当IoT客户端连接IoT实例（服务端）失败时，该函数被调用。
function onConnectFailure(connectedOptions) {
    host = connectedOptions.invocationContext.host;
    port = connectedOptions.invocationContext.port;
    console.log("failed to connect to : " + host + ":" + port);
}

// 当订阅主题成功时，该函数被调用。
function onSubscribeSuccess(response) {
    topic = response.invocationContext.topic;
    qos = response.invocationContext.qos;
    console.log("subscribe topic: " + topic + " with qos: " + qos + " successfully");

}

// 当订阅主题失败时，该函数被调用。
function onSubscribeFailure(response) {
    topic = response.invocationContext.topic;
    errorCode = response.errorCode
    console.log("failed to subscribe topic: " + topic + ", error code: " + errorCode);
}

// 当接收到消息时，该函数被调用。
function onMessageArrived(message) {
    payload = message.payloadString
    topic = message.destinationName
    qos = message.qos
    console.log("received message: " + payload + " from topic: " + topic + " with qos: " + qos);
}

// 当取消订阅的主题成功时，该函数被调用。
function onUnsubscribeSuccess(response) {
    topic = response.invocationContext.topic;
    console.log("unsubscribed topic: " + topic + " successfully");
}

// 当取消订阅的主题失败时，该函数被调用。
function onUnsubscribeFailure(response) {
    topic = response.invocationContext.topic;
    errorCode = response.errorCode;
    errorMessage = response.errorMessage;
    console.log("failed to unsubscribe topic: " + topic + ", error code: " + errorCode + ", error message: " + errorMessage);
}

// 当IoT客户端与IoT实例（服务端）断开连接时，该函数被调用。
function onConnectionLost(response) {
    errorCode = response.errorCode;
    errorMessage = response.errorMessage;
    if (errorCode == 0) {
        console.log("disconnected from iot host.");
    } else {
        console.log("disconnected form iot host, code: " + errorCode + ", message: " + errorMessage);
    }
}
