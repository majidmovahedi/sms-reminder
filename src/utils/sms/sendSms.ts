import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const lineNumber = process.env.SMS_LINE_NUMBER;
const apiKey = process.env.SMS_API_KEY;
const smsConfigUrl = process.env.SMS_CONFIG_URL;

export const sendSMS = async (
    msg: string,
    mobile: string,
): Promise<{ success: boolean }> => {
    const data = JSON.stringify({
        lineNumber: lineNumber,
        messageText: msg,
        mobiles: [mobile],
        sendDateTime: null,
    });

    const config = {
        method: 'post',
        url: smsConfigUrl,
        headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json',
        },
        data: data,
    };

    try {
        const response = await axios(config);

        if (response.data) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error('Error Sending SMS:', error);
        return { success: false };
    }
};
