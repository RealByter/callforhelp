# Firebase Emulator Suite Documentation

## Table of Contents

1. **Introduction**
2. **Getting Started**
3. **Usage**

## Introduction

- **Purpose**: This documentation provides a quick guide for setting up and using the Firebase Emulator Suite for local development.

## Getting Started

- **Installation**: Install Firebase CLI using this command-

  `npm install -g firebase-tools`

- **Authentication**: Log into Firebase using your Google account by running the following command:

  `firebase login`

- **Create a new project**: create a new firebase project using the [firebase console](https://console.firebase.google.com/)
- **Environment Variables**: create a `.env` file within the client folder with the next variable- `VITE_FIREBASE_PROJECT_ID=your-project-id`
- **Open the firebase folder**:

  `cd ./client/src/firebase`

- **Initialize Firebase Emulator**: Use the next commands to initalize the emulator-

  `firebase init emulators`

  This command will let you select the project that you've created,
  and the continue with the default configurations using the Enter key until the proccess is done.

## Usage

- **Firebase Emulator Suite**: Start the suite with `firebase emulators:start` to emulate Firebase services like Firestore, Authentication, and more.
