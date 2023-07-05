const e = require("express");
const fetch = require("node-fetch");
const SendNotification = (message, userIds) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(userIds)
            fetch(`https://onesignal.com/api/v1/notifications`, {
                method: "post",
                body: JSON.stringify({
                    "include_external_user_ids": userIds,
                    "app_id": "1e2f5ae2-89f3-4494-9067-4ae129969e17",
                    "contents": { "en": message, "es": message },
                    "large_icon": "https://i.ibb.co/ZJJY7Rh/ic-launcher-round.png",
                    "isAndroid": false,
                    "isIos": false,
                    "isAnyWeb": true,
                    "isChrome": true,
                    "small_icon": "ic_stat_onesignal_default"
                }),
                headers: {
                    Authorization: `Bearer NzdiYmE4ZWEtYTI5OC00OWVlLTg2YzItMGNiOWIyMGNmNDVh`,
                    "Content-Type": "application/json; charset=utf-8"
                },
            })
                .then((res) => res.json())
                .then(async (json) => {
                    console.log(json)
                    resolve(json)
                })
                .catch((err) => {
                    console.log(err)
                    reject(err);
                });
        } catch (err) {
            reject(err)
        }
    })
}
module.exports = SendNotification;