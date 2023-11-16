/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
const databaseUrl = process.env.DATABASE_URL;

if (!serviceAccountPath) {
  throw new Error("SERVICE_ACCOUNT_PATH environment variable is not set.");
}
if (!databaseUrl) {
  throw new Error("SERVICE_ACCOUNT_PATH environment variable is not set.");
}

let serviceAccount: admin.ServiceAccount;

try {
  serviceAccount = require(serviceAccountPath);
} catch (error: unknown) {
  const err = error as {message: string};
  throw new Error(`Error loading service account file: ${err.message}`);
}

admin.initializeApp({credential: admin.credential.cert(serviceAccount), databaseURL: databaseUrl});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const signUp = onCall((request) => {
  const {email, password, name}: {email?: string, password?: string, name?: string} = request.data;

  if (!email || !password || !name) {
    throw new HttpsError("invalid-argument", "The function requires an email, a password and a name");
  }

  if (request.auth) {
    throw new HttpsError("failed-precondition", "The user must be unauthenticated in order to sign up");
  }

  const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,20}$/);
  const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

  if (!passwordRegex.test(password)) {
    throw new HttpsError("invalid-argument", "The password should include at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and one symbol from the following: @$!%*?&_");
  }
  if (password.length < 8 || password.length > 20) {
    throw new HttpsError("invalid-argument", "The password must have at least 8 characters and no more than 20");
  }

  if (!emailRegex) {
    throw new HttpsError("invalid-argument", "The email must be a valid address");
  }

  if (name.length < 2) {
    throw new HttpsError("invalid-argument", "The name must include at least 2 characters");
  }
});
