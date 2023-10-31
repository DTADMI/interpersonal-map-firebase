"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const buffer_1 = require("buffer");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const privateKey = process.env.FIREBASE_CREDS_PRIVATE_KEY2 ? buffer_1.Buffer.from(process.env.FIREBASE_CREDS_PRIVATE_KEY2, 'base64').toString().replace(/\\n/g, '\n') : undefined;
const serviceAccount = {
    type: process.env.FIREBASE_CREDS_TYPE,
    projectId: process.env.FIREBASE_CREDS_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_CREDS_PRIVATE_KEY_ID,
    privateKey,
    clientEmail: process.env.FIREBASE_CREDS_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CREDS_CLIENT_ID,
    authUri: process.env.FIREBASE_CREDS_AUTH_URI,
    tokenUri: process.env.FIREBASE_CREDS_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_CREDS_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.FIREBASE_CREDS_CLIENT_X509_CERT_URL,
    universeDomain: process.env.FIREBASE_CREDS_UNIVERSE_DOMAIN
};
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount)
});
exports.db = (0, firestore_1.getFirestore)();
