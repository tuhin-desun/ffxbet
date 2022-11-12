import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";
import OverlayLoader from "../component/OverlayLoader";
import { verifyMobile } from "../services/APIServices";
import AppContext from "../context/AppContext";
import Configs from "../config/Configs";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "../config/firebase";

export default class VerifyAccount extends React.Component {
	static contextType = AppContext;
	constructor(props){
		super(props);
		this.state = {
			showLoader: false,
			mobile: "",
			errorMsg: undefined,
			mobileValidationFailed: false,
		};
	
		this.recaptchaVerifier = React.createRef();
	}
	

	submit = () => {
		this.setState(
			{
				errorMsg: undefined,
				mobileValidationFailed: false,
			},
			() => {
				let { mobile } = this.state;

				if (mobile.length !== 10) {
					this.setState({ mobileValidationFailed: true });
				} else {
					this.setState({ showLoader: true });

					let obj = {
						mobile: mobile,
						purpose: Configs.PURPOSE_RESET_PASSWORD,
					};

					verifyMobile(obj).then((response) => {
						if (response.check === Configs.FAILURE_TYPE) {
							this.setState({
								errorMsg: response.message,
								showLoader: false,
							});
						} else {
							this.setState(
								{
									showLoader: false,
								},
								() => {
									let obj = {
										mobile: mobile,
										response: response
									}
									this.sendOTPmessage(obj)
									console.log(response);
									
								}
							);
						}
					});
				}
			}
		);
	};

	sendOTPmessage = (obj) => {
		const phoneProvider = new firebase.auth.PhoneAuthProvider();
					phoneProvider
						.verifyPhoneNumber(
							Configs.PHONE_NUMBER_COUNTRY_CODE + obj.mobile,
							this.recaptchaVerifier.current
						).then((token) => {
							this.setState({ showLoader: false });
							// console.log("hdhdh",response.data);
							this.props.navigation.navigate("OtpVerification", {
								redirect_screen: "ResetPassword",
								firebaseToken: token,
								mobile: obj.mobile,
								...obj.response.data,
							});
						})
						.catch((error) => {
							console.log(error)
						});
	}
	gotoLogin = () => this.props.navigation.navigate("Login");



	//  sendOTP = () => {

	// 	const phoneProvider = new firebase.auth.PhoneAuthProvider();
	// 	phoneProvider
	// 		.verifyPhoneNumber(
	// 			Configs.PHONE_NUMBER_COUNTRY_CODE + this.state.mobile,
	// 		)
	// 		.then((token) => {

	// 		});
	// };

	render = () => (
		<View style={styles.container}>
			<FirebaseRecaptchaVerifierModal
				ref={this.recaptchaVerifier}
				firebaseConfig={firebase.app().options}
				attemptInvisibleVerification={true}
			/>
			<View style={styles.topbg}>
				<View style={styles.imageContainer}>
					<View style={styles.ImageStyle}>
						<FontAwesome name="user-circle" size={60} color={Colors.primary} />
					</View>
				</View>
			</View>
			<View style={styles.loginboxcontainer}>
				<View style={styles.loginbox}>
					<Text style={styles.heading1}>VERIFY ACCOUNT</Text>

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
								placeholder="Enter Mobile Number"
								keyboardType="numeric"
								autoCompleteType="off"
								maxLength={10}
								onChangeText={(mobile) => this.setState({ mobile })}
							/>
						</View>
					</View>

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
					<Text style={styles.heading6}>Back to</Text>
					<TouchableOpacity onPress={this.gotoLogin}>
						<Text style={[styles.heading6, styles.fontBold]}>{" Sign In"}</Text>
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
		backgroundColor: "#eaeaea",
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
		top: Math.floor((windowHeight * 35) / 100),
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
		color: "#a3a3a3",
		marginVertical: 15,
		color: Colors.primary,
		fontSize: 14,
	},
	heading5: {
		color: Colors.warning,
		opacity: 0.9,
		fontWeight: "bold",
		fontSize: 12,
		marginTop: 3,
		marginBottom: 30,
		alignSelf: "flex-end",
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
		borderColor: Colors.secondary,
		backgroundColor: Colors.secondary,
		alignItems: "center",
		justifyContent: "center",
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
