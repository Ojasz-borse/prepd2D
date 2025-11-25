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
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
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
                projectId: "cc19cd71-5c57-4e2c-98ee-b48dddb896a3"
            }
        },
    },
};
