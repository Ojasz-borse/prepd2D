// app.config.js
import 'dotenv/config';

export default {
    expo: {
        name: "PrepAcademy",
        slug: "PrepAcademy",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "prepacademy",
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
            package: "com.anonymous.PrepAcademy"
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/icon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],

            "expo-secure-store"
        ],
        experiments: {
            typedRoutes: true
        },

        extra: {
            SERVER_URL: process.env.SERVER_URL,
            eas: {
                projectId: "7683fa74-ce9f-4e10-8d94-747c11bf92eb"  // 👈 paste here
            }
        },
    },
};
