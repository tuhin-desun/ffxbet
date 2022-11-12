import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Linking,
} from "react-native";
import Colors from "../config/colors";
import Header from "../component/Header";
import AppContext from "../context/AppContext";

class Contact extends React.Component {
	static contextType = AppContext;

	state = {
		defaultMsg: "Hi, I need your help.",
	};

	toggleDrawer = () => this.props.navigation.toggleDrawer();

	makeCall = () => {
		let settings = this.context.appSettings;
		let phoneNumber =
			typeof settings.mobile_number !== "undefined"
				? settings.mobile_number
				: null;

		if (phoneNumber !== null) {
			phoneNumber = "+91" + phoneNumber;
			Linking.openURL(`tel:${phoneNumber}`);
		}
	};

	openWhatsApp = () => {
		let { defaultMsg } = this.state;
		let settings = this.context.appSettings;
		let whatsAppNumber =
			typeof settings.whatsapp_number !== "undefined"
				? settings.whatsapp_number
				: null;

		if (whatsAppNumber !== null) {
			whatsAppNumber = "+91" + whatsAppNumber;
			Linking.openURL(
				`whatsapp://send?phone=+${whatsAppNumber}&text=${defaultMsg}`
			);
		}
	};

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Contact"}
				leftIconName={"menu"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.toggleDrawer}
				{...this.props}
			/>
			<View style={styles.profileImageContainer}>
				<Image
					source={require("../assets/customer-support.jpg")}
					style={styles.ImageStyle}
				/>
			</View>
			<View style={styles.happy}>
				<Text style={styles.happyText}>WE ARE HAPPY TO HELP YOU</Text>
				<Text style={styles.queryText}>
					Just give us a Call or Whatsapp your query
				</Text>
				<Text style={styles.resolveText}>
					Our Support Executive will resolve your query as on priority
				</Text>
			</View>
			<View style={styles.icon}>
				<TouchableOpacity
					activeOpacity={1}
					style={styles.imageContainer}
					onPress={this.makeCall}
				>
					<Image
						source={require("../assets/call.png")}
						style={styles.iconImage}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1}
					style={styles.imageContainer}
					onPress={this.openWhatsApp}
				>
					<Image
						source={require("../assets/whatsapp.png")}
						style={styles.iconImage}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	profileImageContainer: {
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 12,
		marginVertical: 10,
	},
	ImageStyle: {
		height: 200,
		width: 200,
		borderRadius: 40,
	},
	happy: {
		alignItems: "center",
		//flex:1,
	},
	happyText: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors.primary,
	},
	queryText: {
		fontSize: 18,
		textAlign: "center",
		paddingVertical: 15,
	},
	resolveText: {
		fontSize: 18,
		textAlign: "center",
		paddingHorizontal: 50,
	},
	icon: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginVertical: 50,
		paddingHorizontal: 70,
	},
	iconImage: {
		height: 80,
		width: 80,
	},
	imageContainer: {
		height: 80,
		width: 80,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 80 / 2,
		shadowColor: Colors.dark,
		shadowOffset: {
			width: 2,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
});
export default Contact;
