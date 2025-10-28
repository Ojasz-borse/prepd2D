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

export const PREDICT_PERCENTILE = `${extra.SERVER_URL}/api/estimator/predictPercentile`;
export const PREDICT_RANK = `${extra.SERVER_URL}/api/estimator/predictRank`;

export const GET_CHAT_LLM_RESPONSE = `${extra.SERVER_URL}/api/chatllm`;

export const MY_LIST_API_URL = `${extra.SERVER_URL}/api/my-option-form`;

export const GET_PYQS = `${extra.SERVER_URL}/api/pyqs/chapter/id`;

export const GET_PYQ_CHAPTERS = `${extra.SERVER_URL}/api/pyqs/chapter`;