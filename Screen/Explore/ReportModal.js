import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportModal({ visible, onClose, onSubmit, selectedDate }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            setLoading(true);
            const userDataStr = await AsyncStorage.getItem("userData");
            const user = userDataStr ? JSON.parse(userDataStr) : null;
            const token = await AsyncStorage.getItem("userToken");

            if (!user || !token) return;

            // Fix date bug by using YYYY-MM-DD format with LOCAL time components
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            const response = await api.post(
                "/reports",
                {
                    patientId: user.id,
                    content: content.trim(),
                    reportDate: formattedDate,
                    status: "Reports",
                },
                token
            );

            if (response.success) {
                setContent("");
                onSubmit();
                onClose();
            }
        } catch (error) {
            console.error("Failed to submit report:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            style={styles.modalContentWrapper}
                        >
                            <View style={styles.card}>
                                <View style={styles.header}>
                                    <Text style={styles.headerTitle}>Add Report Note</Text>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color="#111827" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.dateDisplay}>
                                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                    <Text style={styles.dateText}>
                                        {selectedDate.toLocaleDateString("en-US", {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </Text>
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder="What would you like to report?"
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={6}
                                    value={content}
                                    onChangeText={setContent}
                                    textAlignVertical="top"
                                />

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={onClose}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.submitButton,
                                            (!content.trim() || loading) && styles.submitButtonDisabled,
                                        ]}
                                        onPress={handleSubmit}
                                        disabled={!content.trim() || loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.submitButtonText}>Submit</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContentWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    closeButton: {
        padding: 4,
    },
    dateDisplay: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    dateText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4B5563",
        marginLeft: 6,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        color: "#111827",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        minHeight: 120,
        maxHeight: 200,
        textAlignVertical: "top",
        marginBottom: 20,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        height: 52,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButtonText: {
        color: "#4B5563",
        fontSize: 15,
        fontWeight: "600",
    },
    submitButton: {
        flex: 1,
        backgroundColor: "#111827",
        borderRadius: 14,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonDisabled: {
        backgroundColor: "#9CA3AF",
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
});
