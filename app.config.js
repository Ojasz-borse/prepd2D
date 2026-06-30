// app.config.js
import 'dotenv/config';

export default {
    expo: {
        name: "PrepDSE",
        slug: "prepdse",
        version: "2.0.9",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "prepdse",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true
        },
        android: {
            versionCode: 19,
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            softwareKeyboardLayoutMode: "resize",
            package: "com.anonymous.PrepDSE",

            // CHANGE 1: Use 'blockedPermissions' instead of 'excludedPermissions'
            permissions: [],
            blockedPermissions: [
                "android.permission.READ_MEDIA_IMAGES",
                "android.permission.READ_MEDIA_VIDEO",
                "android.permission.READ_MEDIA_AUDIO",
                "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE"
            ],

            enableProguardInReleaseBuilds: true,
            // proguardRules: "./proguard-rules.pro" // Only keep this if you actually have a custom file
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/icon.png"
        },
        // Remove expo-splash-screen completely
        plugins: [
            "expo-router",
            "expo-secure-store"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            SERVER_URL: process.env.SERVER_URL,
            RAZORPAY_KEY: process.env.RAZORPAY_KEY,
            eas: {
                // projectId: "4bdd8255-e16b-4789-91b2-24afb5107930"
                projectId: "d659fd19-f78f-466b-b5e5-d74fc1c2a947"
            }
        },
    },
};
