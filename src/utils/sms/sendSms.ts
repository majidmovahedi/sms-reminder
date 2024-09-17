import axios from 'axios';

export const sendSMS = async (msg: string, mobile: string) => {
    const data = JSON.stringify({
        lineNumber: 30007487129399,
        messageText: msg,
        mobiles: [mobile],
        sendDateTime: null,
    });

    const config = {
        method: 'post',
        url: 'https://api.sms.ir/v1/send/bulk',
        headers: {
            'X-API-KEY':
                'sfaNzvEyDLHXKDmjcYFFNPAcPl86d6Azlrl3piHJUcZOGTWHawsbXtMiAMnqXVOf',
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
