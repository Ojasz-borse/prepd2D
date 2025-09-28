import Constants from "expo-constants";
const extra = Constants.expoConfig?.extra || {};
export const SIGNUP_REQUEST_OTP = `${extra.SERVER_URL}/api/auth/signup/request-otp`;
export const SIGNUP_VERIFY_OTP = `${extra.SERVER_URL}/api/auth/signup/verify-otp`;
export const LOGIN = `${extra.SERVER_URL}/api/auth/login`;

export const FORGOT_PASSWORD_REQUEST_OTP = `${extra.SERVER_URL}/api/auth/forgot-password/request-otp`;
export const FORGOT_PASSWORD_VERIFY_OTP = `${extra.SERVER_URL}/api/auth/forgot-password/verify-otp`;
export const FORGOT_PASSWORD_RESET = `${extra.SERVER_URL}/api/auth/forgot-password/reset`;

export const GET_NEWS = `${extra.SERVER_URL}/api/news`;
export const SAVE_PUSH_TOKEN = `${extra.SERVER_URL}/api/notifications/save-push-token`;

export const GET_COLLEGES = `${extra.SERVER_URL}/api/colleges/normal`;
export const GET_COLLEGE_BRANCHES = `${extra.SERVER_URL}/api/colleges/advanced`;
