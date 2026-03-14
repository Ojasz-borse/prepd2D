import { colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
    ZoomIn,
    ZoomOut
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabName = "Home" | "Admission process" | "SMart option form" | "Colleges" | "Mock Tests" | "Preparation";

interface CustomNavbarProps {
    activeTab: TabName;
    onTabChange: (tab: TabName) => void;
}

const tabs: { name: TabName; icon: keyof typeof Feather.glyphMap }[] = [
    { name: "Home", icon: "home" },
    { name: "Admission process", icon: "file-minus" },
    { name: "SMart option form", icon: "clipboard" },
    { name: "Colleges", icon: "search" },
];

export default function CustomNavbar({
    activeTab,
    onTabChange,
}: CustomNavbarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: 15 + insets.bottom }]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                // The image shows active color as a strong blue #004aad
                const activeColor = "#004aad";
                // Inactive color is typically dark gray/black in the image
                const inactiveColor = "#004aad";

                return (
                    <AnimatedPressable
                        key={tab.name}
                        onPress={() => onTabChange(tab.name)}
                        layout={LinearTransition.duration(200)} // Simple smooth transition without spring
                        style={[
                            styles.tab,
                            isActive && styles.activeTab,
                            isActive && { backgroundColor: "rgba(0, 74, 173, 0.1)" },
                        ]}
                    >
                        <Feather
                            name={tab.icon}
                            size={24}
                            color={isActive ? activeColor : inactiveColor}
                        />

                        {isActive && (
                            <Animated.View
                                entering={FadeIn.duration(200).delay(100)} // Slight delay to let width expand first
                                exiting={FadeOut.duration(50)} // Quick exit to prevent overlap
                                style={styles.labelContainer}
                            >
                                <Text style={[styles.label, { color: activeColor }]}>
                                    {tab.name}
                                </Text>
                            </Animated.View>
                        )}
                    </AnimatedPressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff", // Light cream background from image
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 0, // Navbar usually flush at bottom

        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 30, // Pill shape
    },
    activeTab: {
        // Background color is handled inline to allow easy changing later if needed, 
        // but we can move it here. 
        // The user asked for #004aad for active states.
        // We typically want a very light version of it for the background.
        backgroundColor: "rgba(0, 74, 173, 0.1)",
    },
    labelContainer: {
        marginLeft: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "SourceSans3SemiBold", // Assuming this font is available as seen in other files
    },
});
