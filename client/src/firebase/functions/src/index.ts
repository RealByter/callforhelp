/* eslint-disable no-throw-literal */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as serviceAccount from "./callforhelp-37002-firebase-adminsdk-7ivya-e3e03f01cb.json";

const DATABASE_URL = "https://callforhelp-37002-default-rtdb.firebaseio.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: DATABASE_URL,
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const signUp = functions.https.onCall(async (request) => {
  const {email, password, name}: { email?: string; password?: string; name?: string } =
    request.data;

  if (!email || !password || !name) {
    logger.error("The function requires an email, a password and a name: " + request);
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function requires an email, a password and a name"
    );
  }

  if (request.auth) {
    logger.error("The user must be unauthenticated in order to sign up: " + request);
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The user must be unauthenticated in order to sign up"
    );
  }

  const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,20}$/
  );
  const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

  try {
    if (!passwordRegex.test(password)) {
      logger.error("The password should include at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and one symbol from the following: @$!%*?&_: " + request);
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The password should include at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and one symbol from the following: @$!%*?&_"
      );
    }
  } catch (error) {
    logger.error("Error checking regex: " + error + ", " + request);
    throw new functions.https.HttpsError("internal", "Error checking regex: " + error);
  }
  if (password.length < 8 || password.length > 20) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The password must have at least 8 characters and no more than 20"
    );
  }

  try {
    if (!emailRegex) {
      logger.error("The email must be a valid address: " + request);
      throw new functions.https.HttpsError("invalid-argument", "The email must be a valid address");
    }
  } catch (error) {
    logger.error("Error checking regex: " + error + ", " + request);
    throw new functions.https.HttpsError("internal", "Error checking regex: " + error);
  }

  if (name.length < 2) {
    logger.error("The name must include at least 2 characters: " + request);
    throw new functions.https.HttpsError("invalid-argument", "The name must include at least 2 characters");
  }

  try {
    const userRecord = await admin.auth().createUser({email, password});
    const usersCollection = admin.firestore().collection("users");

    try {
      await usersCollection.doc(userRecord.uid).set({name, acceptedTerms: true});
      try {
        await admin.auth().updateUser(userRecord.uid, {displayName: name});
      } catch (error) {
        await usersCollection.doc(userRecord.uid).delete();
        throw ""; // to get the the error throw below
      }
    } catch (error) {
      await admin.auth().deleteUser(userRecord.uid);
      throw ""; // to get to the actual error throw
    }
  } catch (error) {
    logger.error("An error occurred while creating the user: " + request);
    throw new functions.https.HttpsError("internal", "An error occurred while creating the user");
  }
});
