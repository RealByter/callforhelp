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

import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import * as serviceAccount from './callforhelp-37002-firebase-adminsdk-7ivya-e3e03f01cb.json';
import {
  EMAIL_ERROR_MESSAGES,
  GENERAL_ERROR_MESSAGES,
  PASSWORD_ERROR_MESSAGES,
  USERNAME_ERROR_MESSAGES
} from './consts';

const DATABASE_URL = 'https://callforhelp-37002-default-rtdb.firebaseio.com';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: DATABASE_URL
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const signUp = functions.https.onCall(async (request) => {
  logger.log(request);
  const { email, password, name }: { email?: string; password?: string; name?: string } = request;

  if (!email || !password || !name) {
    logger.error(GENERAL_ERROR_MESSAGES.missingCredentials.english + request);
    throw new functions.https.HttpsError(
      'invalid-argument',
      GENERAL_ERROR_MESSAGES.missingCredentials.hebrew
    );
  }

  if (request.auth) {
    logger.error(GENERAL_ERROR_MESSAGES.alreadyAuthenticated.english + request);
    throw new functions.https.HttpsError(
      'failed-precondition',
      GENERAL_ERROR_MESSAGES.alreadyAuthenticated.hebrew
    );
  }

  const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,128}$/
  );
  const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

  if (password.length < 8 || password.length > 128) {
    logger.error(PASSWORD_ERROR_MESSAGES.length.english + request);
    throw new functions.https.HttpsError('invalid-argument', PASSWORD_ERROR_MESSAGES.length.hebrew);
  }
  try {
    if (!passwordRegex.test(password)) {
      logger.error(PASSWORD_ERROR_MESSAGES.regex.english + request);
      throw 'failed test'; // The text here really doesn't matter so I didn't bother with a const
    }
  } catch (error) {
    logger.error('Error checking regex: ' + error + ', ' + request);
    throw new functions.https.HttpsError('invalid-argument', PASSWORD_ERROR_MESSAGES.regex.hebrew);
  }

  if (email.length > 254) {
    logger.error(EMAIL_ERROR_MESSAGES.length.english + request);
    throw new functions.https.HttpsError('invalid-argument', EMAIL_ERROR_MESSAGES.length.english);
  }
  try {
    if (!emailRegex) {
      logger.error(EMAIL_ERROR_MESSAGES.regex.english + request);
      throw 'failed test'; // Same here with the text
    }
  } catch (error) {
    logger.error('Error checking regex: ' + error + ', ' + request);
    throw new functions.https.HttpsError('invalid-argument', EMAIL_ERROR_MESSAGES.regex.hebrew);
  }

  if (name.length < 2 || name.length > 40) {
    logger.error(USERNAME_ERROR_MESSAGES.length.english + request);
    throw new functions.https.HttpsError('invalid-argument', USERNAME_ERROR_MESSAGES.length.hebrew);
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    const usersCollection = admin.firestore().collection('users');

    try {
      await usersCollection.doc(userRecord.uid).set({ name, acceptedTerms: true });
      try {
        await admin.auth().updateUser(userRecord.uid, { displayName: name });
      } catch (error) {
        await usersCollection.doc(userRecord.uid).delete();
        throw ''; // to get the the error throw below
      }
    } catch (error) {
      await admin.auth().deleteUser(userRecord.uid);
      throw ''; // to get to the actual error throw
    }
  } catch (error) {
    const err = error as { message: string };
    logger.error(GENERAL_ERROR_MESSAGES.general.english + error + ', ' + request);
    if (err.message === EMAIL_ERROR_MESSAGES.alreadyExists.english) {
      throw new functions.https.HttpsError(
        'already-exists',
        EMAIL_ERROR_MESSAGES.alreadyExists.hebrew
      );
    } else {
      throw new functions.https.HttpsError('internal', GENERAL_ERROR_MESSAGES.general.hebrew);
    }
  }
});

export const updateName = functions.https.onCall(async (request) => {
  logger.log(request);

  const { name }: { name?: string } = request;

  if (!name) {
    logger.error(GENERAL_ERROR_MESSAGES.missingCredentials.updateName.english + request);
    throw new functions.https.HttpsError(
      'invalid-argument',
      GENERAL_ERROR_MESSAGES.missingCredentials.updateName.hebrew
    );
  }

  if (request.auth) {
    logger.error(GENERAL_ERROR_MESSAGES.notAuthenticated.english + request);
    throw new functions.https.HttpsError(
      'failed-precondition',
      GENERAL_ERROR_MESSAGES.notAuthenticated.hebrew
    );
  }

  if (name.length < 2 || name.length > 40) {
    logger.error(USERNAME_ERROR_MESSAGES.length.english + request);
    throw new functions.https.HttpsError('invalid-argument', USERNAME_ERROR_MESSAGES.length.hebrew);
  }

  try {
    const userRecord = await admin.auth().getUser(request.auth.uid);
    const previousName = userRecord.displayName;
    const usersCollection = admin.firestore().collection('users');
    await usersCollection.doc(request.auth.uid).update({ name });

    try {
      await admin.auth().updateUser(userRecord.uid, { displayName: name });
    } catch (error) {
      await usersCollection.doc(request.auth.uid).update({ name: previousName });
      throw ''; // to get the the error throw below
    }
  } catch (error) {
    logger.error(GENERAL_ERROR_MESSAGES.general.updateName.english + error + ', ' + request);
    throw new functions.https.HttpsError(
      'internal',
      GENERAL_ERROR_MESSAGES.general.updateName.hebrew
    );
  }
});
