import React from "react";
import {
	Text,
	View,
	Dimensions,
	TouchableOpacity,
	StyleSheet,
	Image,
	Linking
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import { getWalletBalance } from "../services/APIServices";
import AppContext from "../context/AppContext";

const winowWidth = Dimensions.get("window").width;

export default class Header extends React.Component {
	static contextType = AppContext;

	state = {
		defaultMsg: "Hi, I need your help.",
	};

	componentDidMount = () => {
		this.focusListener = this.props.navigation.addListener(
			"focus",
			this.onScreenFocus
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	onScreenFocus = () => {
		let customerData = this.context.customerData;
		getWalletBalance(customerData.cust_code)
			.then((amount) => {
				customerData.amount = amount;
				this.context.setCustomerData(customerData);
			})
			.catch((error) => console.log(error));
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
		<>
			<StatusBar style="light" backgroundColor={Colors.primary} />
			<View style={styles.header}>
				<View style={styles.left}>
					{this.props.hasOwnProperty("leftIconName") ? (
						<TouchableOpacity
							activeOpacity={1}
							onPress={this.props.leftButtonFunc}
							style={styles.leftBtn}
						>
							<Ionicons
								name={this.props.leftIconName}
								size={25}
								color={Colors.white}
							/>
						</TouchableOpacity>
					) : null}
				</View>
				<View style={styles.titleBox}>
					<Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleText}>
						{this.props.title}
					</Text>
				</View>
				<View style={styles.right}>
					{this.props.hasOwnProperty("rightIconName") ? (
						<>
						
						<View style={{}}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={this.props.rightButtonFunc}
								style={styles.rightBtn}
							>
								{/* <View style={{width: '90%', flexDirection: 'row'}}> */}
									
									<View style={{width: '70%'}}>
										<Text style={styles.amountText}>
											{" "}
											{this.context.customerData !== null
												? parseInt(this.context.customerData.amount)
												: 0}
										</Text>
									</View>
									<TouchableOpacity activeOpacity={1} >
										<View style={{}}>
											<Ionicons
												name={this.props.rightIconName}
												size={22}
												color={Colors.secondary}
												style={{left: 0, right: 0, bottom: 0}}
											/>
										</View>
									</TouchableOpacity>
								{/* </View> */}
							</TouchableOpacity>
							</View>
							<View style={{flexDirection: 'row', justifyContent: 'center', marginTop:12, width: '1%'}}>
							<TouchableOpacity style={{right: 0}} activeOpacity={1} onPress={this.openWhatsApp}>
								<Image source={require('../assets/whatsapp.png')} style={{width: 25, height: 25}} />
							</TouchableOpacity>
						</View>
							</>
					) : null}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		marginTop: Constants.statusBarHeight,
		height: 50,
		width: winowWidth,
		backgroundColor: Colors.primary,
		elevation: 5,
	},
	left: {
		width: "15%",
	},
	leftBtn: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	titleBox: {
		width: "46%",
		// alignItems: "center",
		justifyContent: "center",
	},
	titleText: {
		fontSize: 20,
		color: Colors.white,
	},
	right: {
		width: "42%",
		flexDirection: 'row',
	},
	rightBtn: {
		flexDirection: "row",
		width: "90%",
		height: "100%",
		alignItems: "center",
	},
	amountText: {
		color: Colors.secondary,
		fontSize: 16,
		fontSize: 18,
		marginRight: 5, 
		fontVariant: ['tabular-nums'], 
		textAlign: "right"
	},
});
