# 🎉 Birthday SMS Reminder System

## Overview

This project is a **Birthday SMS Reminder System** that allows users to register the birthdays of important people in their lives and receive a reminder SMS on the scheduled date. After signing up and subscribing, users can easily add titles and birth dates to manage these special days efficiently.

### Features:

- **Register and manage birthdays**
- **Send reminder SMS** to users via [sms.ir](https://www.sms.ir)
- **Manage user subscriptions** using [Passport.js](https://www.passportjs.org)
- **Secure payment gateway** via [Zibal](https://www.zibal.ir)
- **MongoDB database** for storing user and birthday information
- Built with **TypeScript** for a safe and scalable codebase
- Powered by **Express.js** as the main server framework
- **OTP authentication** using [Redis](https://redis.io) to send one-time passwords
- **JWT** for handling token-based authentication and session management
- **Password hashing and recovery** using [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Data validation** with [Zod](https://zod.dev)
- **Scheduled SMS reminders** using [CronJob](https://www.npmjs.com/package/node-cron)

## Technologies & Tools

- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [MongoDB](https://www.mongodb.com)
- [Passport.js](https://www.passportjs.org)
- [Docker](https://www.docker.com)
- [sms.ir](https://www.sms.ir) (for sending reminder SMS)
- [Zibal](https://www.zibal.ir) (for online payment)
- [Redis](https://redis.io) (for OTP and caching)
- [JWT](https://jwt.io) (for secure token-based authentication)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (for password hashing)
- [Zod](https://zod.dev) (for data validation)
- [CronJob](https://www.npmjs.com/package/node-cron) (for scheduling SMS reminders)

---

## 🛠️ Installation and Setup

### 1. Prerequisites

Ensure that **Docker** and **Docker Compose** are installed on your system. If not, you can install them using the following links:

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### 2. Clone the Project

Clone the project by running the following commands:

```bash
git clone https://github.com/majidmovahedi/sms-reminder.git
cd sms-reminder
