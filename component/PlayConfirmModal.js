import React from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Modal,
	Dimensions,
} from "react-native";
import Colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
	},
	modalContainer: {
		minHeight: 200,
		width: windowWidth,
		backgroundColor: Colors.white,
	},
	modalHeader: {
		flexDirection: "row",
		paddingVertical: 15,
		paddingLeft: 15,
		paddingRight: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		alignItems: "center",
		justifyContent: "space-between",
	},
	modalTitle: {
		fontSize: 18,
		color: "#444",
	},
	closeBtn: {
		width: 30,
		height: 30,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#ddd",
	},
	submitBtn: {
		alignSelf: "center",
		paddingHorizontal: 15,
		paddingVertical: 8,
		backgroundColor: Colors.success,
		marginBottom: 15,
		borderRadius: 5,
	},
	submitBtnText: {
		fontSize: 16,
		color: Colors.white,
		letterSpacing: 0.5,
	},
});

const PlayConfirmModal = (props) => (
	<Modal
		animationType="fade"
		transparent={true}
		statusBarTranslucent={true}
		visible={props.visible}
	>
		<View style={styles.modalOverlay}>
			<View style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<Text style={styles.modalTitle}>Play Game</Text>
					<TouchableOpacity
						activeOpacity={1}
						onPress={props.onClose}
						style={styles.closeBtn}
					>
						<Ionicons name="close" size={22} color="#444" />
					</TouchableOpacity>
				</View>
				{props.children}
				<TouchableOpacity
					activeOpacity={1}
					onPress={props.onSubmit}
					style={styles.submitBtn}
				>
					<Text style={styles.submitBtnText}>Submit</Text>
				</TouchableOpacity>
			</View>
		</View>
	</Modal>
);

export default PlayConfirmModal;
