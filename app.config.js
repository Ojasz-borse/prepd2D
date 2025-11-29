// app.config.js
import 'dotenv/config';

export default {
    expo: {
        name: "PrepCET",
        slug: "prepcet",
        version: "1.3.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "prepcet",
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
            versionCode: 4,
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            softwareKeyboardLayoutMode: "resize",
            package: "com.anonymous.PrepCET",

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
            eas: {
                projectId: "d659fd19-f78f-466b-b5e5-d74fc1c2a947"
            }
        },
    },
};
