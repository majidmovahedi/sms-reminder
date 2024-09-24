import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const lineNumber = process.env.SMS_LINE_NUMBER;
const apiKey = process.env.SMS_API_KEY;

export const sendSMS = async (msg: string, mobile: string) => {
    const data = JSON.stringify({
        lineNumber: lineNumber,
        messageText: msg,
        mobiles: [mobile],
        sendDateTime: null,
    });

    const config = {
        method: 'post',
        url: 'https://api.sms.ir/v1/send/bulk',
        headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json',
        },
        data: data,
    };

    axios(config)
        .then(function (response) {
            JSON.stringify(response.data);
            // console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
};
