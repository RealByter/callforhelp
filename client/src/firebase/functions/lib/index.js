"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const serviceAccount = require("./callforhelp-37002-firebase-adminsdk-7ivya-e3e03f01cb.json");
const DATABASE_URL = "https://callforhelp-37002-default-rtdb.firebaseio.com";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL,
});
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
exports.signUp = functions.https.onCall(async (request) => {
    logger.log(request);
    const { email, password, name } = request;
    if (!email || !password || !name) {
        logger.error("The function requires an email, a password and a name: " + request);
        throw new functions.https.HttpsError("invalid-argument", "צריך אימייל, סיסמא ואימייל");
    }
    if (request.auth) {
        logger.error("The user must be unauthenticated in order to sign up: " + request);
        throw new functions.https.HttpsError("failed-precondition", "אי אפשר להירשם בתור משתמש מחובר");
    }
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,20}$/);
    const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    try {
        if (!passwordRegex.test(password)) {
            logger.error("The password should include at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and one symbol from the following: @$!%*?&_: " + request);
            throw new functions.https.HttpsError("invalid-argument", "הסיסמא צריכה להכיל לפחות אות קטנה אחת, אות גדולה אחת, מספר וסימן מיוחד (@,$,!,%,*,?,&,_)");
        }
    }
    catch (error) {
        logger.error("Error checking regex: " + error + ", " + request);
        throw new functions.https.HttpsError("invalid-argument", "הסיסמא צריכה להכיל לפחות אות קטנה אחת, אות גדולה אחת, מספר וסימן מיוחד (@,$,!,%,*,?,&,_)");
    }
    if (password.length < 8 || password.length > 20) {
        throw new functions.https.HttpsError("invalid-argument", "הסיסמא חייבת לכלול לפחות 8 תווים ולא יותר מ-20");
    }
    try {
        if (!emailRegex) {
            logger.error("The email must be a valid address: " + request);
            throw new functions.https.HttpsError("invalid-argument", "האימייל צריך להיות תקין");
        }
    }
    catch (error) {
        logger.error("Error checking regex: " + error + ", " + request);
        throw new functions.https.HttpsError("invalid-argument", "האימייל צריך להיות תקין");
    }
    if (name.length < 2) {
        logger.error("The name must include at least 2 characters: " + request);
        throw new functions.https.HttpsError("invalid-argument", "השם צריך לכלול לפחות 2 אותיות");
    }
    try {
        const userRecord = await admin.auth().createUser({ email, password });
        const usersCollection = admin.firestore().collection("users");
        try {
            await usersCollection.doc(userRecord.uid).set({ name, acceptedTerms: true });
            try {
                await admin.auth().updateUser(userRecord.uid, { displayName: name });
            }
            catch (error) {
                await usersCollection.doc(userRecord.uid).delete();
                throw ""; // to get the the error throw below
            }
        }
        catch (error) {
            await admin.auth().deleteUser(userRecord.uid);
            throw ""; // to get to the actual error throw
        }
    }
    catch (error) {
        const err = error;
        logger.error("An error occurred while creating the user: " + error + ", " + request);
        if (err.message === "The email address is already in use by another account.") {
            throw new functions.https.HttpsError("already-exists", "אי אפשר ליצור יותר ממשתמש אחד עם אותו אימייל");
        }
        else {
            throw new functions.https.HttpsError("internal", "An error occurred while creating the user");
        }
    }
});
//# sourceMappingURL=index.js.map