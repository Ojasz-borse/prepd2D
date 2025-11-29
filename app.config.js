// app.config.js
import 'dotenv/config';

export default {
    expo: {
        name: "PrepCET",
        slug: "prepcet",
        version: "1.0.0",
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
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            softwareKeyboardLayoutMode: "resize",
            package: "com.anonymous.PrepCET"
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
