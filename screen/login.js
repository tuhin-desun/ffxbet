import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Image,
	Dimensions,
	StatusBar
} from "react-native";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";
import OverlayLoader from "../component/OverlayLoader";
import { signin, saveDeviceToken } from "../services/APIServices";
import { writeCustomerData, getDeviceToken } from "../utils/Util";
import AppContext from "../context/AppContext";
import Configs from "../config/Configs";

export default class Login extends React.Component {
	static contextType = AppContext;

	state = {
		showLoader: false,
		mobile: "",
		password: "",
		errorMsg: undefined,
		mobileValidationFailed: false,
		passwordValidationFailed: false,
	};

	submit = () => {
		this.setState(
			{
				errorMsg: undefined,
				mobileValidationFailed: false,
				passwordValidationFailed: false,
			},
			() => {
				let { mobile, password } = this.state;

				if (mobile.length !== 10) {
					this.setState({ mobileValidationFailed: true });
				} else if (password.trim().length === 0) {
					this.setState({ passwordValidationFailed: true });
				} else {
					let obj = { mobile, password };
					this.setState({ showLoader: true });

					signin(obj)
						.then((response) => {
							let responseData = response.data;

							if (response.check === Configs.SUCCESS_TYPE) {
								getDeviceToken()
									.then((tokenData) => {
										if (tokenData !== null) {
											let reqObj = {
												cust_code: responseData.cust_code,
												token: tokenData.data,
											};

											saveDeviceToken(reqObj)
												.then((tokenRes) => {
													this.setState(
														{
															showLoader: false,
														},
														() => {
															this.context.setCustomerData(responseData);
															writeCustomerData(responseData);
														}
													);
												})
												.catch((error) => {
													console.log(error);
													this.setState({ showLoader: false });
													this.context.setCustomerData(responseData);
													writeCustomerData(responseData);
												});
										} else {
											this.setState({ showLoader: false });
											this.context.setCustomerData(responseData);
											writeCustomerData(responseData);
										}
									})
									.catch((error) => {
										console.log(error);
										this.setState({ showLoader: false });
										this.context.setCustomerData(response.data);
										writeCustomerData(response.data);
									});
							} else {
								this.setState({
									showLoader: false,
									errorMsg: response.message,
								});
							}
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	gotoSignUpPage = () => this.props.navigation.navigate("Registration");

	gotoVerifyAccount = () => this.props.navigation.navigate("VerifyAccount");

	render = () => (
		<View style={styles.container}>
			<StatusBar style="light" backgroundColor={Colors.primary} />
			<View style={styles.topbg}>
				<View style={styles.imageContainer}>
					<Image
						style={styles.ImageStyle}
						source={require("../assets/logo.png")}
					/>
				</View>
			</View>
			<View style={styles.loginboxcontainer}>
				<View style={styles.loginbox}>
					<Text style={styles.heading1}>SIGN IN</Text>

					<View
						style={[
							styles.inputBox,
							this.state.mobileValidationFailed ? styles.borderRed : null,
						]}
					>
						<Text style={styles.label}>Mobile Number</Text>
						<View style={styles.inputGroup}>
							<FontAwesome
								name="mobile-phone"
								size={18}
								style={styles.textInputIcon}
							/>
							<TextInput
								value={this.state.mobile}
								style={styles.textfield}
								label="Password"
								placeholder="Mobile Number"
								keyboardType="numeric"
								autoCompleteType="off"
								maxLength={10}
								onChangeText={(mobile) => this.setState({ mobile })}
							/>
						</View>
					</View>

					<View
						style={[
							styles.inputBox,
							styles.mb0,
							this.state.passwordValidationFailed ? styles.borderRed : null,
						]}
					>
						<Text style={styles.label}>Passoword</Text>
						<View style={styles.inputGroup}>
							<FontAwesome name="lock" size={16} style={styles.textInputIcon} />
							<TextInput
								value={this.state.password}
								label="Password"
								placeholder="Password"
								autoCompleteType="off"
								secureTextEntry={true}
								style={[styles.textfield, styles.mb0]}
								onChangeText={(password) => this.setState({ password })}
							/>
						</View>
					</View>

					<TouchableOpacity
						activeOpacity={1}
						onPress={this.gotoVerifyAccount}
						style={styles.forgetPassBtn}
					>
						<Text style={styles.heading5}>Forgot Password ?</Text>
					</TouchableOpacity>

					{typeof this.state.errorMsg !== "undefined" ? (
						<Text style={styles.errorText}>{this.state.errorMsg}</Text>
					) : null}

					<TouchableOpacity
						activeOpacity={1}
						style={styles.button}
						onPress={this.submit}
					>
						<Text style={styles.textWhite}>SUBMIT</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flexDirection: "row" }}>
					<Text style={[styles.heading6,{color:'white'}]}>New Here?</Text>
					<TouchableOpacity onPress={this.gotoSignUpPage}>
						<Text style={[styles.heading6, styles.fontBold,{color:'white'}]}>
							{" Create Account"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<OverlayLoader visible={this.state.showLoader} />
		</View>
	);
}

const windowHeight = Dimensions.get("window").height;
const topbgHeight =
	Math.floor((windowHeight * 50) / 100) + Constants.statusBarHeight;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary,
		position: "relative",
		width: "100%",
	},
	topbg: {
		backgroundColor: Colors.primary,
		height: topbgHeight,
		width: "100%",
		// position: "absolute",
		// top: 0,
		alignItems: "center",
	},
	loginboxcontainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		// top: "30%",
		top: Math.floor((windowHeight * 25) / 100),
		width: "100%",
	},
	loginbox: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 15,
		width: "90%",
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	heading1: {
		fontSize: 30,
		color: Colors.secondary,
		textAlign: "center",
		marginBottom: 20,
	},
	label: {
		color: Colors.primary,
		fontSize: 12,
		textTransform: "uppercase",
		marginBottom: 0,
	},
	inputBox: {
		position: "relative",
		marginBottom: 30,
		borderBottomWidth: 2,
		borderColor: Colors.primary,
		borderRadius: 10,
	},
	inputGroup: {
		flexDirection: "row",
		alignItems: "center",
	},
	textInputIcon: {
		marginLeft: 8,
		color: Colors.primary,
	},
	textfield: {
		backgroundColor: "#fff",
		paddingHorizontal: 10,
		paddingVertical: 10,
		width: "95%",
	},
	mb0: {
		marginBottom: 0,
	},
	button: {
		alignItems: "center",
		backgroundColor: Colors.secondary,
		paddingVertical: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		borderRadius: 20,
		color: "#fff",
	},
	textWhite: {
		color: "#fff",
		fontWeight: "bold",
	},
	heading6: {
		color: Colors.white,
		marginVertical: 15,
		color: Colors.primary,
		fontSize: 14,
	},
	forgetPassBtn: {
		paddingVertical: 3,
		paddingLeft: 3,
		alignSelf: "flex-end",
		marginBottom: 25,
	},
	heading5: {
		color: "#73017A",
		opacity: 0.9,
		fontWeight: "bold",
		fontSize: 12,
		// marginTop: 3,
		// marginBottom: 30,
		// alignSelf: "flex-end",
	},
	fontBold: {
		fontWeight: "bold",
	},
	imageContainer: {
		// height: "50%",
		height: Math.floor((topbgHeight * 50) / 100),
		alignItems: "center",
		justifyContent: "center",
		// paddingTop: "15%"
	},
	ImageStyle: {
		height: 100,
		width: 100,
		alignSelf: "center",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "yellow",
		backgroundColor: Colors.secondary,
	},
	borderRed: {
		borderColor: Colors.danger,
	},
	errorText: {
		color: Colors.danger,
		fontStyle: "italic",
		textAlign: "center",
		marginBottom: 20,
	},
});
