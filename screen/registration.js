import * as React from "react";
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
import { verifyMobile } from "../services/APIServices";
import AppContext from "../context/AppContext";
import Configs from "../config/Configs";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "../config/firebase";
//import firebase from "../config/firebase";

export default class Registration extends React.Component {

	static contextType = AppContext;
	
	constructor(props){
		super(props)
		this.state = {
			showLoader: false,
			name: "",
			mobile: "",
			password: "",
			nameErrorMsg: undefined,
			mobileErrorMsg: undefined,
			passwordErrorMsg: undefined,
		};
		this.recaptchaVerifier = React.createRef();
	}
	

	submit = () => {
		
		this.setState(
			{
				nameErrorMsg: undefined,
				mobileErrorMsg: undefined,
				passwordErrorMsg: undefined,
			},
			() => {
				let { name, mobile, password } = this.state;

				if (name.trim().length === 0) {
					this.setState({ nameErrorMsg: "Enter your name" });
				} else if (mobile.trim().length !== 10 || isNaN(mobile)) {
					this.setState({
						mobileErrorMsg: "Enter your 10 digit mobile no.",
					});
				} else if (password.trim().length === 0) {
					this.setState({ passwordErrorMsg: "Enter your password" });
				} else if (password.trim().length > 0 && password.trim().length < 6) {
					this.setState({
						passwordErrorMsg: "Password contain atleast 6th character",
					});
				} else {
					this.setState({ showLoader: true });
					verifyMobile({ mobile }).then((response) => {
						if (response.check === Configs.FAILURE_TYPE) {
							this.setState({
								showLoader: false,
								mobileErrorMsg: response.message,
							});
						} else {
							let obj = {
								name: name,
								mobile: mobile,
								password: password,
								mcode: response.data.mcode,
							}
							this.sendOTPmessage(obj)
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
							// console.log(response.data);
							this.props.navigation.navigate("OtpVerification", {
								name: obj.name,
								mobile: obj.mobile,
								password: obj.password,
								mcode: obj.mcode,
								firebaseToken: token
							});
						})
						.catch((error) => {
							console.log(error)
						});
	}

	render = () => (
		<View style={styles.container}>
			<StatusBar style="light" backgroundColor={Colors.primary} />
			<FirebaseRecaptchaVerifierModal
				ref={this.recaptchaVerifier}
				firebaseConfig={firebase.app().options}
				attemptInvisibleVerification={true}
			/>
			<OverlayLoader visible={this.state.showLoader} />
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
					<Text style={styles.heading1}>SIGN UP</Text>

					<View
						style={[
							styles.inputBox,
							typeof this.state.nameErrorMsg !== "undefined"
								? styles.mb0
								: null,
						]}
					>
						<Text style={styles.label}>Name</Text>
						<View style={styles.inputGroup}>
							<FontAwesome
								name="user-o"
								size={16}
								style={styles.textInputIcon}
							/>
							<TextInput
								value={this.state.name}
								label="Name"
								placeholder="Name"
								autoCompleteType="off"
								style={styles.textfield}
								onChangeText={(name) => this.setState({ name })}
								autoCapitalize="words"
							/>
						</View>
					</View>
					{typeof this.state.nameErrorMsg !== "undefined" ? (
						<Text style={styles.errorText}>{this.state.nameErrorMsg}</Text>
					) : null}

					<View
						style={[
							styles.inputBox,
							typeof this.state.mobileErrorMsg !== "undefined"
								? styles.mb0
								: null,
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
					{typeof this.state.mobileErrorMsg !== "undefined" ? (
						<Text style={styles.errorText}>{this.state.mobileErrorMsg}</Text>
					) : null}

					<View
						style={[
							styles.inputBox,
							typeof this.state.passwordErrorMsg !== "undefined"
								? styles.mb0
								: null,
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
					{typeof this.state.passwordErrorMsg !== "undefined" ? (
						<Text style={styles.errorText}>{this.state.passwordErrorMsg}</Text>
					) : null}

					<TouchableOpacity style={styles.button} onPress={this.submit}>
						<Text style={styles.textWhite}>CREATE MY ACCOUNT</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flexDirection: "row" }}>
					<Text style={[styles.heading6,{color:'white'}]}>Already have an account?</Text>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("Login")}
					>
						<Text style={[styles.heading6, styles.fontBold,{color:'white'}]}> Sign In</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const windowHeight = Dimensions.get("window").height;
const topbgHeight =
	Math.floor((windowHeight * 50) / 100) + Constants.statusBarHeight;

const styles = StyleSheet.create({
	loginbg: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: Colors.primary,
		position: "relative",
		width: "100%",
	},
	topbg: {
		backgroundColor: Colors.primary,
		// height: "50%",
		height: topbgHeight,
		width: "100%",
		// position: "absolute",
		// top: Constants.statusBarHeight,
		alignItems: "center",
	},
	imageContainer: {
		// height: "50%",
		height: Math.floor((topbgHeight * 50) / 100),
		alignItems: "center",
		justifyContent: "center",
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
	button: {
		alignItems: "center",
		backgroundColor: Colors.secondary,
		paddingVertical: 15,
		shadowColor: Colors.secondary,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		borderRadius: 20,
	},
	textWhite: {
		color: "#fff",
		fontWeight: "bold",
	},
	heading6: {
		marginVertical: 15,
		color: Colors.primary,
		fontSize: 14,
	},
	heading5: {
		color: "#8e8e8e",
		fontSize: 12,
		marginBottom: 30,
	},
	fontBold: {
		fontWeight: "bold",
	},
	mb0: {
		marginBottom: 0,
	},
	errorText: {
		color: Colors.danger,
		fontStyle: "italic",
		fontSize: 13,
		fontWeight: "bold",
		alignSelf: "flex-end",
		marginBottom: 20,
		marginRight: 5,
	},
});
