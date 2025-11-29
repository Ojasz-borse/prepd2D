import TopHeader from "@/components/TopHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Help() {
  const openPrivacyPage = () => {
    Linking.openURL("https://www.prepcet.in/privacy-and-policy.html");
  };

  const openDeletePolicyPage = () => {
    Linking.openURL("https://www.prepcet.in/account-deletion-policy.html");
  };

  const sendSupportMail = () => {
    Linking.openURL("mailto:team@prepcet.in");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <TopHeader title="Help" showBackArrow={true} />

      <ScrollView
        style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}
        showsVerticalScrollIndicator={false}
      >
        {/* PAGE TITLE */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: "SourceSans3Medium",
            marginBottom: 20,
          }}
        >
          Help & Support
        </Text>

        {/* CONTACT SUPPORT */}
        <View
          style={{
            padding: 18,
            backgroundColor: "#f5f7ff",
            borderRadius: 12,
            marginBottom: 25,
            borderWidth: 1,
            borderColor: "#dce3ff",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "SourceSans3SemiBold",
              marginBottom: 8,
            }}
          >
            Contact Support
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "SourceSans3Medium",
              color: "#555",
              marginBottom: 15,
            }}
          >
            team@prepcet.in — you can email us for any queries or support.
          </Text>

          <TouchableOpacity
            onPress={sendSupportMail}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="mail-outline" size={20} color="#004aad" />
            <Text
              style={{
                color: "#004aad",
                fontSize: 14,
                fontFamily: "SourceSans3Medium",
              }}
            >
              Send Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* PRIVACY POLICY */}
        <View
          style={{
            padding: 18,
            backgroundColor: "#f5f7ff",
            borderRadius: 12,
            marginBottom: 25,
            borderWidth: 1,
            borderColor: "#dce3ff",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "SourceSans3SemiBold",
              marginBottom: 8,
            }}
          >
            Privacy Policy
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "SourceSans3Medium",
              color: "#555",
              marginBottom: 15,
            }}
          >
            Your privacy is our priority. Learn how PrepCET collects, uses, and
            protects your personal information.
          </Text>

          <TouchableOpacity
            onPress={openPrivacyPage}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="document-text-outline" size={20} color="#004aad" />
            <Text
              style={{
                color: "#004aad",
                fontSize: 14,
                fontFamily: "SourceSans3Medium",
              }}
            >
              View Full Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* DELETE ACCOUNT */}
        <View
          style={{
            padding: 18,
            backgroundColor: "#fff5f5",
            borderRadius: 12,
            marginBottom: 25,
            borderWidth: 1,
            borderColor: "#ffb3b3",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "SourceSans3SemiBold",
              marginBottom: 8,
              color: "#d32f2f",
            }}
          >
            Delete Account
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "SourceSans3Medium",
              color: "#7a0000",
              marginBottom: 15,
            }}
          >
            Learn how to permanently delete your account and remove all your
            data from our system.
          </Text>

          <TouchableOpacity
            onPress={openDeletePolicyPage}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#d32f2f" />
            <Text
              style={{
                color: "#d32f2f",
                fontSize: 14,
                fontFamily: "SourceSans3Medium",
              }}
            >
              View Deletion Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
