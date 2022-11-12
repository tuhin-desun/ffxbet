import * as React from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Dimensions,
	ToastAndroid,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import Colors from "../config/colors";
import OverlayLoader from "../component/OverlayLoader";
import { resetPassword } from "../services/APIServices";
import AppContext from "../context/AppContext";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "../config/firebase";

export default class ResetPassword extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			showLoader: false,
			mobile:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.mobile
					: undefined,
			mcode:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.mcode
					: undefined,
			firebaseOTP:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.firebaseOTP
					: undefined,
			firebaseToken:
				typeof this.props.route.params !== "undefined"
					? this.props.route.params.firebaseToken
					: undefined,
			password: "",
			confirmPassword: "",
			passwordErrorMsg: undefined,
			confirmPasswordErrorMsg: undefined,
		}

		this.recaptchaVerifier = React.createRef();
	}


	submit = () => {

		this.setState(
			{
				passwordErrorMsg: undefined,
				confirmPasswordErrorMsg: undefined,
			},
			() => {
				let { password, confirmPassword } = this.state;

				if (password.trim().length === 0) {
					this.setState({ passwordErrorMsg: "Enter your password" });
				} else if (password.trim().length > 0 && password.trim().length < 6) {
					this.setState({
						passwordErrorMsg: "Password contain atleast 6th character",
					});
				} else if (password !== confirmPassword) {
					this.setState({
						confirmPasswordErrorMsg: "Password and Confirm Password not match",
					});
				} else {
					this.setState({ showLoader: true });

					let obj = {
						mobile: this.state.mobile,
						password: this.state.password,
						mcode: this.state.mcode,
					};

					const credential = firebase.auth.PhoneAuthProvider.credential(
						this.state.firebaseToken,
						this.state.firebaseOTP
					);

					firebase.auth().signInWithCredential(credential).then((result) => {
						console.log(result)
						resetPassword(obj)
							.then((response) => {
								this.setState(
									{
										showLoader: false,
										password: "",
										confirmPassword: "",
										passwordErrorMsg: undefined,
										confirmPasswordErrorMsg: undefined,
									},
									() => {
										ToastAndroid.show(response.message, ToastAndroid.SHORT);
									}
								);
							})
							.catch((error) => {
								this.setState({ showLoader: false });
								console.log(error);
							});
					})
						.catch((err) => { console.log(err) })

				}
			}
		);
	};

	render = () => (
		<View style={styles.container}>
			<FirebaseRecaptchaVerifierModal
				ref={this.recaptchaVerifier}
				firebaseConfig={firebase.app().options}
				attemptInvisibleVerification={true}
			/>
			<OverlayLoader visible={this.state.showLoader} />
			<View style={styles.topbg}>
				<View style={styles.imageContainer}>
					<View style={styles.ImageStyle}>
						<FontAwesome name="lock" size={60} color={Colors.primary} />
					</View>
				</View>
			</View>
			<View style={styles.loginboxcontainer}>
				<View style={styles.loginbox}>
					<Text style={styles.heading1}>RESET PASSWORD</Text>

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
								placeholder="Enter Password"
								autoCompleteType="off"
								secureTextEntry={true}
								style={styles.textfield}
								onChangeText={(password) => this.setState({ password })}
							/>
						</View>
					</View>
					{typeof this.state.passwordErrorMsg !== "undefined" ? (
						<Text style={styles.errorText}>{this.state.passwordErrorMsg}</Text>
					) : null}

					<View
						style={[
							styles.inputBox,
							typeof this.state.confirmPasswordErrorMsg !== "undefined"
								? styles.mb0
								: null,
						]}
					>
						<Text style={styles.label}>Passoword</Text>
						<View style={styles.inputGroup}>
							<FontAwesome name="lock" size={16} style={styles.textInputIcon} />
							<TextInput
								value={this.state.confirmPassword}
								placeholder="Enter Confirm Password"
								autoCompleteType="off"
								secureTextEntry={true}
								style={[styles.textfield, styles.mb0]}
								onChangeText={(confirmPassword) =>
									this.setState({ confirmPassword })
								}
							/>
						</View>
					</View>
					{typeof this.state.confirmPasswordErrorMsg !== "undefined" ? (
						<Text style={styles.errorText}>
							{this.state.confirmPasswordErrorMsg}
						</Text>
					) : null}

					<TouchableOpacity style={styles.button} onPress={this.submit}>
						<Text style={styles.textWhite}>SUBMIT</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flexDirection: "row" }}>
					<Text style={styles.heading6}>Back to </Text>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("Login")}
					>
						<Text style={[styles.heading6, styles.fontBold]}> Sign In</Text>
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
		backgroundColor: "#eaeaea",
		position: "relative",
		width: "100%",
	},
	topbg: {
		backgroundColor: Colors.primary,
		height: topbgHeight,
		width: "100%",
		alignItems: "center",
	},
	imageContainer: {
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
		borderColor: Colors.secondary,
		backgroundColor: Colors.secondary,
		alignItems: "center",
		justifyContent: "center",
	},
	loginboxcontainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: Math.floor((windowHeight * 30) / 100),
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
