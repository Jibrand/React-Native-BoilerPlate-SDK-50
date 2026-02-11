import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReportDetailModal({ visible, onClose, report }) {
    if (!report) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Report Details</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#111827" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.dateDisplay}>
                                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                <Text style={styles.dateText}>
                                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                    {" • "}
                                    {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>

                            <View style={styles.contentWrapper}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={styles.content}>{report.content}</Text>
                                </ScrollView>
                            </View>

                            <TouchableOpacity
                                style={styles.closeAction}
                                onPress={onClose}
                            >
                                <Text style={styles.closeActionText}>Back to List</Text>
                            </TouchableOpacity>
                        </View>
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
        padding: 24,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
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
    contentWrapper: {
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 24,
        maxHeight: 300,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: "#374151",
    },
    closeAction: {
        backgroundColor: "#111827",
        borderRadius: 14,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
    },
    closeActionText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
});
