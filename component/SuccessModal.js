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
import { Feather } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.white,
	},
	modalBody: {
		minHeight: 200,
		width: windowWidth,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.white,
	},
	title: {
		fontSize: 20,
		color: "#444",
		lineHeight: 50,
	},
	subTitle: {
		fontSize: 15,
		color: "#444",
		opacity: 0.8,
		letterSpacing: 0.5,
	},
	submitBtn: {
		position: "absolute",
		bottom: 10,
		width: windowWidth - 16,
		paddingVertical: 15,
		marginHorizontal: 8,
		backgroundColor: Colors.primary,
		borderRadius: 5,
		alignItems: "center",
	},
	submitBtnText: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors.white,
	},
});

const SuccessModal = (props) => (
	<Modal animationType="fade" transparent={true} visible={props.visible}>
		<View style={styles.modalOverlay}>
			<View style={styles.modalBody}>
				<Feather name="check-circle" size={60} color={Colors.success} />
				<Text style={styles.title}>Game Stated Successfully</Text>
				<Text style={styles.subTitle}>
					To check game status, click on My Bid
				</Text>
			</View>
			<TouchableOpacity
				activeOpacity={1}
				onPress={props.onSubmit}
				style={styles.submitBtn}
			>
				<Text style={styles.submitBtnText}>Go to home page</Text>
			</TouchableOpacity>
		</View>
	</Modal>
);

export default SuccessModal;
