import { ID } from "appwrite";

import asyncWithTimeout from "./serviceHelpers";
import { account, config } from "./appwrite";

const userDataStub = {
  fake1: {
    "$id": "689e3b6f000c3e185d6f",
    "$createdAt": "2025-08-14T19:39:27.521+00:00",
    "$updatedAt": "2025-10-06T13:45:54.615+00:00",
    "name": "",
    "registration": "2025-08-14T19:39:27.520+00:00",
    "status": true,
    "labels": [],
    "passwordUpdate": "2025-10-06T13:45:35.801+00:00",
    "email": "fake1@email.com",
    "phone": "",
    "emailVerification": false,
    "phoneVerification": false,
    "mfa": false,
    "prefs": {},
    "targets": [
      {
        "$id": "689e3b6f89b95f81445a",
        "$createdAt": "2025-08-14T19:39:27.564+00:00",
        "$updatedAt": "2025-08-14T19:39:27.564+00:00",
        "name": "",
        "userId": "689e3b6f000c3e185d6f",
        "providerId": null,
        "providerType": "email",
        "identifier": "fake1@email.com",
        "expired": false
      }
    ],
    "accessedAt": "2025-10-06T13:45:54.612+00:00"
  },
  eck_ben: {
    "$id": "689267890026a49a66ea",
    "$createdAt": "2025-08-05T20:20:25.710+00:00",
    "$updatedAt": "2025-08-14T20:03:39.859+00:00",
    "name": "Benjamin Eck",
    "registration": "2025-08-05T20:20:25.709+00:00",
    "status": true,
    "labels": [],
    "passwordUpdate": "2025-08-14T20:03:39.856+00:00",
    "email": "eck_ben@yahoo.com",
    "phone": "+16073517150",
    "emailVerification": true,
    "phoneVerification": false,
    "mfa": false,
    "prefs": {},
    "targets": [
      {
        "$id": "68926789eae4edf5cac9",
        "$createdAt": "2025-08-05T20:20:25.962+00:00",
        "$updatedAt": "2025-08-05T20:20:25.962+00:00",
        "name": "",
        "userId": "689267890026a49a66ea",
        "providerId": null,
        "providerType": "email",
        "identifier": "eck_ben@yahoo.com",
        "expired": false
      },
      {
        "$id": "68926789ee4593e174e7",
        "$createdAt": "2025-08-05T20:20:25.975+00:00",
        "$updatedAt": "2025-08-05T20:20:25.975+00:00",
        "name": "",
        "userId": "689267890026a49a66ea",
        "providerId": null,
        "providerType": "sms",
        "identifier": "+16073517150",
        "expired": false
      }
    ],
    "accessedAt": "2025-08-14 20:03:55.554"
  }
};

const loginDataStub = {
  fake1: {
    "$id": "68e3cacd0ca49b11c073",
    "$createdAt": "2025-10-06T13:57:33.060+00:00",
    "$updatedAt": "2025-10-06T13:57:33.060+00:00",
    "userId": "689e3b6f000c3e185d6f",
    "expire": "2026-10-06T13:57:33.051+00:00",
    "provider": "email",
    "providerUid": "fake1@email.com",
    "providerAccessToken": "",
    "providerAccessTokenExpiry": "",
    "providerRefreshToken": "",
    "ip": "2601:83:4200:2f60:b713:9577:f929:fda8",
    "osCode": "AND",
    "osName": "Android",
    "osVersion": "11",
    "clientType": "browser",
    "clientCode": "SB",
    "clientName": "Samsung Browser",
    "clientVersion": "14.2",
    "clientEngine": "Blink",
    "clientEngineVersion": "87.0.4280.141",
    "deviceName": "smartphone",
    "deviceBrand": "Samsung",
    "deviceModel": "Galaxy S10",
    "countryCode": "us",
    "countryName": "United States",
    "current": true,
    "factors": [
      "password"
    ],
    "secret": "",
    "mfaUpdatedAt": ""
  },
  eck_ben: {
    "$id": "689e412acc585b3370b7",
    "$createdAt": "2025-08-14T20:03:55.243+00:00",
    "$updatedAt": "2025-08-14T20:03:55.243+00:00",
    "userId": "689267890026a49a66ea",
    "expire": "2026-08-14T20:03:54.837+00:00",
    "provider": "email",
    "providerUid": "eck_ben@yahoo.com",
    "providerAccessToken": "",
    "providerAccessTokenExpiry": "",
    "providerRefreshToken": "",
    "ip": "2601:83:4200:2f60:a422:db35:bb1:4bea",
    "osCode": "AND",
    "osName": "Android",
    "osVersion": "11",
    "clientType": "browser",
    "clientCode": "SB",
    "clientName": "Samsung Browser",
    "clientVersion": "14.2",
    "clientEngine": "WebKit",
    "clientEngineVersion": "537.36",
    "deviceName": "smartphone",
    "deviceBrand": "Samsung",
    "deviceModel": "Galaxy S10",
    "countryCode": "us",
    "countryName": "United States",
    "current": true,
    "factors": [
      "password"
    ],
    "secret": "",
    "mfaUpdatedAt": ""
  }
};

const authService = {
  // Register a user
  async register(email, password) {
    let registerResponse;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      registerResponse = { success: true };
    } else {
      registerResponse = await asyncWithTimeout(
        account.create(ID.unique(), email, password),
        undefined,
        'Registration failed. Please try again'
      );
    }
    return registerResponse;
  },
  // Send verification
  async sendVerification() {
    const sendVerificationResponse = await asyncWithTimeout(
      account.createVerification(config.verificationEndpoint),
      undefined,
      'Failed to send verification email. Please try again.'
    );
    return sendVerificationResponse;
  },
  // Verify user's email
  async verify(userId, secret) {
    let verifyResponse;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      verifyResponse = { success: true };
    } else {
      verifyResponse = await asyncWithTimeout(
        account.updateVerification(userId, secret),
        undefined,
        'Verification failed. Please try again'
      );
    }
    return verifyResponse;
  },
  // Login
  async login(email, password) {
    let loginData;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      loginData = loginDataStub;
    } else {
      loginData = await asyncWithTimeout(
        account.createEmailPasswordSession(email, password),
        undefined,
        'Login failed. Please check your credentials'
      );
    }

    return loginData;
  },
  // Get logged in user
  async getUser(isOnMount=false) {
    let userData;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      userData = userDataStub[config.stub];
    } else {
      userData = await asyncWithTimeout(
        account.get(),
        undefined,
        'Failed to get user information. Please try again',
        undefined,
        isOnMount ? ['User (role: guests) missing scopes (["account"])'] : undefined
      );
    }

    return userData;
  },
  // Logout
  async logout() {
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
    } else {
      await asyncWithTimeout(
        account.deleteSession('current'),
        undefined,
        'Logout failed. Please try again'
      );
    }
  },
  // Change user password
  async updatePassword(newPassword, currentPassword) {
    let results;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      results = { success: true };
    } else {
      results = await asyncWithTimeout(
        account.updatePassword(newPassword, currentPassword),
        undefined,
        'Failed to change password. Please try again'
      );
    }
    return results;
  },
  // Send user an account recovery link
  async sendRecoveryLink(email) {
    let results;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      results = { success: true };
    } else {
      results = await asyncWithTimeout(
        account.createRecovery(email, config.recoveryEndpoint),
        undefined,
        'Failed to send recovery link. Please try again'
      );
    }
    return results;
  },
  // Recover the users' account
  async updateRecovery(userId, secret, password) {
    let recoveryResponse;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      recoveryResponse = { success: true };
    } else {
      recoveryResponse = await asyncWithTimeout(
        account.updateRecovery(userId, secret, password),
        undefined,
        'Recovery failed. Please try again'
      );
    }
    return recoveryResponse;
  },
};

export default authService;