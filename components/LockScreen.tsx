import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown
} from 'react-native-reanimated';

interface LockedFeatureModalProps {
    isVisible: boolean;
    onClose: () => void;
    featureName: string;
}

const { height } = Dimensions.get('window');

export default function LockScreen({
    isVisible,
    onClose,
    featureName,
}: LockedFeatureModalProps) {
    if (!isVisible) return null;

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose}>
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                    />
                </Pressable>

                <Animated.View
                    entering={SlideInDown.springify().damping(20)}
                    exiting={SlideOutDown}
                    style={styles.content}
                >
                    <View style={styles.handle} />

                    <View style={styles.iconContainer}>
                        <View style={styles.lockCircle}>
                            <Ionicons name="lock-closed" size={40} color="#fff" />
                        </View>
                    </View>

                    <Text style={styles.title}>{featureName} is Premium</Text>
                    <Text style={styles.description}>
                        This feature is exclusively available for subscribed members. Get access to all PYQs, Mock Tests, and Advanced College Search.
                    </Text>

                    <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.8}>
                        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Maybe Later</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        marginBottom: 20,
    },
    iconContainer: {
        marginBottom: 20,
    },
    lockCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#004aad',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontFamily: 'SourceSans3Bold',
        color: '#004aad',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        fontFamily: 'SourceSans3Medium',
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    subscribeButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#004aad',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    subscribeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'SourceSans3SemiBold',
    },
    closeButton: {
        paddingVertical: 12,
    },
    closeButtonText: {
        color: '#94a3b8',
        fontSize: 16,
        fontFamily: 'SourceSans3Medium',
    },
});
