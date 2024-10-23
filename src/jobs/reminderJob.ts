import cron from 'node-cron';
import Reminder from '@models/reminderModel';
import Subscription from '@models/subscriptionModel';
import { sendSMS } from '@utils/sms/sendSms';

export const reminderJob = cron.schedule(
    '* * * * *',
    async () => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        console.log(
            `Checking reminders for ${currentMonth}/${currentDay} ${currentHour}:${currentMinute}`,
        );

        const reminders = await Reminder.find({
            month: currentMonth,
            day: currentDay,
            hour: currentHour,
            minute: currentMinute,
        }).populate('userId');

        for (const reminder of reminders) {
            const userId = reminder.userId._id;
            console.log(`Found reminder for user ${userId}: ${reminder.title}`);

            const subscription = await Subscription.findOne({
                userId: userId,
                status: 'Active',
                smsCount: { $gt: 0 },
            });

            if (subscription) {
                const message = `*_${reminder.title}_* \n ${reminder.reminderText}`;
                const phoneNumber = reminder.userId.phoneNumber;

                try {
                    const smsResult = await sendSMS(message, phoneNumber);
                    console.log(
                        `SMS sent to ${phoneNumber}: ${smsResult.success}`,
                    );

                    if (smsResult.success) {
                        subscription.smsCount -= 1;
                        await subscription.save();
                        console.log(
                            `Decreased SMS count for user ${userId} to ${subscription.smsCount}`,
                        );
                    }
                } catch (error) {
                    console.error(
                        `Failed to send SMS to ${phoneNumber}:`,
                        error,
                    );
                }
            } else {
                console.log(
                    `User ${userId} has no active subscription or no remaining SMS.`,
                );
            }
        }
    },
    {
        timezone: 'Asia/Tehran',
    },
);
