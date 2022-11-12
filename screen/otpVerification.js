import React, { useState, useEffect, useContext, useRef } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";
import OverlayLoader from "../component/OverlayLoader";
import { writeCustomerData, getDeviceToken } from "../utils/Util";
import { signup, sendOTP, saveDeviceToken } from "../services/APIServices";
import AppContext from "../context/AppContext";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "../config/firebase";

const CELL_COUNT = 6;

const OtpVerification = ({ route, navigation }) => {
	const context = useContext(AppContext);

	const [value, setValue] = useState("");
	const [otp, setOTP] = useState(route.params.mcode);
	const [timerValue, setTimerValue] = useState(60);
	const [timerExpired, setTimerExpired] = useState(false);
	const [showLoader, setShowLoader] = useState(false);
	const [otpValidationFailed, setOTPValidation] = useState(false);
	const recaptchaVerifier = useRef(null);
	const [verificationToken, setVerificationToken] = useState(
		route.params !== "undefined" ? route.params.firebaseToken : undefined
	);
	const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

	const updateTimer = () => {
		const x = setInterval(() => {
			if (timerValue <= 1) {
				setTimerExpired(true);
			} else {
				setTimerValue(timerValue - 1);
			}
		}, 1000);
		return x;
	};

	const resenOTP = () => {
		const phoneProvider = new firebase.auth.PhoneAuthProvider();
		phoneProvider
			.verifyPhoneNumber(
				Configs.PHONE_NUMBER_COUNTRY_CODE + route.params.mobile,
				recaptchaVerifier.current
			)
			.then((token) => {
				setTimerExpired(false);
				setTimerValue(60);
				setVerificationToken(token);
			});
	};

	useEffect(() => {
		const timer = updateTimer();
		return () => clearInterval(timer);
	}, [timerValue]);

	const verifyOTP = (value) => {
		if (value != null) {
			setValue(value);
			if (value.length === CELL_COUNT) {
	
					let redirectScreen = route.params.hasOwnProperty("redirect_screen")
						? route.params.redirect_screen
						: undefined;

					if (typeof redirectScreen === "undefined") {
						setShowLoader(true);

						let obj = {
							full_name: route.params.name,
							mobile: route.params.mobile,
							password: route.params.password,
							mcode: otp,
						};
						const credential = firebase.auth.PhoneAuthProvider.credential(
							verificationToken,
							value
						);
					
						firebase.auth().signInWithCredential(credential)
						.then((result) => {
							signup(obj)
							.then((response) => {
								let responseData = response.data;
								let custCode = responseData.cust_code;

								getDeviceToken()
									.then((tokenData) => {
										if (tokenData !== null) {
											let reqObj = {
												cust_code: custCode,
												token: tokenData.data,
											};

											saveDeviceToken(reqObj)
												.then((tokenRes) => {
													setShowLoader(false);
													writeCustomerData(responseData);
													context.setCustomerData(responseData);
												})
												.catch((error) => {
													console.log(error);
													setShowLoader(false);
													writeCustomerData(responseData);
													context.setCustomerData(responseData);
												});
										} else {
											setShowLoader(false);
											writeCustomerData(responseData);
											context.setCustomerData(responseData);
										}
									})
									.catch((error) => {
										console.log(error);
										setShowLoader(false);
										writeCustomerData(responseData);
										context.setCustomerData(responseData);
									});
							})
							.catch((error) => console.log(error));
						})
						.catch((err)=>{
							console.log(err)
						});

						
						
					} else {
						navigation.navigate("ResetPassword", {
							mobile: route.params.mobile,
							mcode: otp,
							firebaseOTP: value,
							firebaseToken: verificationToken
						});
					}

			}
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<Image style={styles.icon} source={require("../assets/otp_img.png")} />
			</View>
			<View style={{ alignItems: "center", flex: 0.5 }}>
				<Text style={styles.subTitle}>
					Enter the verification code sent to you on your mobile number
				</Text>
			</View>
			<View style={styles.fieldRow}>
				<CodeField
					ref={ref}
					{...props}
					value={value}
					onChangeText={verifyOTP}
					cellCount={CELL_COUNT}
					rootStyle={styles.codeFieldRoot}
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					renderCell={({ index, symbol, isFocused }) => (
						<Text
							key={index}
							style={[
								styles.cell,
								isFocused && styles.focusCell,
								otpValidationFailed ? styles.dangerBorder : null,
							]}
							onLayout={getCellOnLayoutHandler(index)}
						>
							{symbol || (isFocused ? <Cursor /> : null)}
						</Text>
					)}
				/>
			</View>
			<View style={{ flex: 1, alignItems: "center" }}>
				{timerExpired ? (
					<TouchableOpacity
						activeOpacity={0.6}
						style={styles.resendOtp}
						onPress={() => resenOTP()}
					>
						<FontAwesome name="repeat" size={14} color={Colors.danger} />
						<Text style={styles.resentOtpText}> Resend OTP</Text>
					</TouchableOpacity>
				) : (
					<Text>
						Resend OTP in{" "}
						<Text style={{ color: Colors.danger }}>{timerValue + " Secs"}</Text>
					</Text>
				)}
			</View>
			<FirebaseRecaptchaVerifierModal
						ref={recaptchaVerifier}
						firebaseConfig={firebase.app().options}
						attemptInvisibleVerification={true}
					/>
			<OverlayLoader visible={showLoader} />
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
		paddingHorizontal: 10,
		backgroundColor: Colors.white,
		paddingTop: Constants.statusBarHeight,
	},
	codeFieldRoot: {
		flex: 1,
		alignItems: "center",
	},
	cell: {
		width: 55,
		height: 55,
		lineHeight: 55,
		fontSize: 30,
		fontWeight: "700",
		textAlign: "center",
		marginLeft: 8,
		borderRadius: 6,
		backgroundColor: Colors.lightGrey,
	},
	fieldRow: {
		flex: 0.6,
		alignItems: "center",
		justifyContent: "center",
	},
	focusCell: {
		borderColor: Colors.secondary,
	},
	icon: {
		width: 217 / 2.4,
		height: 158 / 2.4,
		marginLeft: "auto",
		marginRight: "auto",
	},
	iconContainer: {
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
	},
	subTitle: {
		paddingTop: 30,
		color: Colors.secondary,
		textAlign: "center",
	},
	title: {
		flex: 1,
		textAlign: "center",
		fontSize: 30,
	},
	dangerBorder: {
		borderWidth: 1,
		borderColor: Colors.danger,
	},
	resendOtp: {
		flexDirection: "row",
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	resentOtpText: {
		color: Colors.danger,
		fontWeight: "bold",
		fontSize: 16,
	},
});
export default OtpVerification;
