/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("SERVICE_ACCOUNT_PATH environment variable is not set.");
}

let serviceAccount: any;

try {
  serviceAccount = require(serviceAccountPath);
} catch (error: unknown) {
  const err = error as {message: string};
  throw new Error(`Error loading service account file: ${err.message}`);
}


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onCall((request) => {
  logger.info("Hello logs!", {structuredData: true});
  logger.log("data: " + request.data);
  return "Hello from Firebase!";
});
