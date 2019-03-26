var dotenv = require("dotenv").config();
var Pushbullet = require("pushbullet");
var Axios = require("axios");

var pushbulettToken = process.env.PUSHBULLET_TOKEN;
var emailToBeNotified = process.env.EMAIL;
var serverAddress = process.env.SERVER;

var notification = {
    title: "Server is down",
    content: "Start it now!"
}

var pb = new Pushbullet(pushbulettToken);

Axios.get(serverAddress, {
    validateStatus: function (status) {
        return status < 500;
    }
})
    .catch(err => {
        let messages = [];
        if (err.response)
            messages.push("Status: " + err.response.status);
        messages.push("Error Message: " + err.message);

        var currentDate = new Date();

        var date = currentDate.getDate();
        var month = currentDate.getMonth(); //Be careful! January is 0 not 1
        var year = currentDate.getFullYear();
        var hour = currentDate.getHours();
        var minute = currentDate.getMinutes();
        var second = currentDate.getSeconds();

        var dateString = `${date}/${month}/${year} ${hour}:${minute}:${second}`;
        messages.push(`Timestamp: ${dateString}`);

        notification.content = messages.join("\n");

        pb.note(emailToBeNotified, notification.title, notification.content);
    })
