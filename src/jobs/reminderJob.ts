import cron from 'node-cron';
import Reminder from '@models/reminderModel';
import { sendSMS } from '@utils/sms/sendSms';

// Check ReminderJob
export const reminderJob = cron.schedule(
    '* * * * *',
    async () => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Find matched Reminders
        const reminders = await Reminder.find({
            month: currentMonth,
            day: currentDay,
            hour: currentHour,
            minute: currentMinute,
        }).populate('userId');

        // Send SMS Reminder
        reminders.forEach((reminder) => {
            const message = `*_${reminder.title}_* \n ${reminder.reminderText}`;
            const phoneNumber = reminder.userId.phoneNumber;
            sendSMS(message, phoneNumber);
        });
    },
    {
        timezone: 'Asia/Tehran',
    },
);
