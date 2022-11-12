import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
// import { RadioButton } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Configs from "../config/Configs";
import Colors from "../config/colors";
import Header from "../component/Header";
import OverlayLoader from "../component/OverlayLoader";
import { withdrawBalance } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class WithdrawBalance extends React.Component {
	static contextType = AppContext;

	state = {
		settings: null,
		amount: undefined,
		txnMode: Configs.TRANSACTION_MODES[0].key,
		amountValidationErrorMsg: undefined,
		errorMsg: undefined,
		showLoader: false,
	};

	goBack = () => this.props.navigation.goBack();

	gotoUpdateAccountScreen = () =>
		this.props.navigation.navigate("Update Account");

	withdrawRequest = () => {
		this.setState(
			{
				amountValidationErrorMsg: undefined,
				errorMsg: undefined,
			},
			() => {
				let { amount } = this.state;
				let settings = this.context.appSettings;

				if (typeof amount === "undefined") {
					this.setState({ amountValidationErrorMsg: "Enter Amount" });
				} else if (
					isNaN(amount) ||
					!Number.isInteger(parseFloat(amount)) ||
					parseFloat(amount) <= 0
				) {
					this.setState({ amountValidationErrorMsg: "Invalid Amount" });
				} else if (parseInt(amount) < parseInt(settings.min_withdraw_amount)) {
					this.setState({
						amountValidationErrorMsg:
							"Minimum withdraw amount is Rs. " +
							parseInt(settings.min_withdraw_amount),
					});
				} else {
					this.setState({ showLoader: true });
					let customerData = this.context.customerData;
					let obj = {
						cust_code: customerData.cust_code,
						amount: amount,
						// type: this.state.txnMode,
					};

					withdrawBalance(obj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								this.setState(
									{
										amount: undefined,
										txnMode: Configs.TRANSACTION_MODES[0].key,
										amountValidationErrorMsg: undefined,
										errorMsg: undefined,
										showLoader: false,
									},
									() => {
										ToastAndroid.show(
											response.message + "\nPlease wait for approval",
											ToastAndroid.SHORT
										);
									}
								);
							} else {
								this.setState({
									amountValidationErrorMsg: undefined,
									errorMsg: response.message,
									showLoader: false,
								});
							}
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Withdraw Balance"}
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.goBack}
				{...this.props}
			/>
			<View style={styles.instContainer}>
				<Text style={styles.instruction}>
					WITHDRAWAL MONEY REQUEST WILL BE ACCEPTED FROM 10:00 AM TO 9:00
					PM MONDAY TO SATURDAY. 10 AM TO 2 PM ON SUNDAY. NO WITHDRAWAL
					MONEY REQUEST WILL BE ACCEPTED ON HOLIDAYS. WITHDRAWAL MONEY WILL BE 
					CREDITED WITH IN 5 TO 50 MINUTE
				</Text>
			</View>
			<View style={styles.loginboxcontainer}>
				<View style={styles.loginbox}>
					<View
						style={[
							styles.inputBox,
							typeof this.state.amountValidationErrorMsg !== "undefined"
								? styles.inputError
								: null,
						]}
					>
						<Text style={styles.label}>Amount</Text>
						<View style={styles.inputGroup}>
							<FontAwesome
								name="money"
								size={18}
								style={styles.textInputIcon}
							/>
							<TextInput
								value={this.state.amount}
								style={styles.textfield}
								onChangeText={(amount) => this.setState({ amount })}
								placeholder="Enter Amount"
								autoCompleteType="off"
								keyboardType="numeric"
							/>
						</View>
					</View>
					{typeof this.state.amountValidationErrorMsg !== "undefined" ? (
						<Text style={styles.errorText}>
							{this.state.amountValidationErrorMsg}
						</Text>
					) : null}

					{/* <View style={[styles.inputBox, styles.radioButtonContainer]}>
						<Text style={styles.label}>Tranfer Mode</Text>
						{Configs.TRANSACTION_MODES.map((element) => (
							<TouchableOpacity
								key={element.key}
								style={styles.radioButton}
								onPress={() => this.setState({ checked: element.key })}
							>
								<RadioButton
									value={element.key}
									status={
										this.state.txnMode === element.key ? "checked" : "unchecked"
									}
									onPress={() => this.setState({ txnMode: element.key })}
									color={Colors.primary}
									uncheckedColor={Colors.primary}
								/>
								<Text style={styles.radiolabel}>{element.value}</Text>
							</TouchableOpacity>
						))}
					</View> */}
					{typeof this.state.errorMsg !== "undefined" ? (
						<Text style={[styles.errorText, styles.errorMessage]}>
							{this.state.errorMsg}
						</Text>
					) : null}

					<TouchableOpacity
						style={styles.button}
						onPress={this.withdrawRequest}
					>
						<Text style={styles.textWhite}>REQUEST BALANCE</Text>
					</TouchableOpacity>
				</View>
			</View>
			{/* <TouchableOpacity onPress={this.gotoUpdateAccountScreen}>
				<Text style={styles.linkBtn}>UPDATE WITHDRAW MODE</Text>
			</TouchableOpacity> */}
			<OverlayLoader visible={this.state.showLoader} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	instContainer: {
		marginVertical: 10,
	},
	instruction: {
		fontSize: 14,
		textAlign: "center",
		paddingHorizontal: 10,
		color: "#444",
		opacity: 0.8,
		lineHeight: 20,
	},
	loginboxcontainer: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		padding: 10,
	},
	loginbox: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 15,
		width: "100%",
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	inputBox: {
		position: "relative",
		marginBottom: 30,
		borderBottomWidth: 2,
		borderColor: Colors.primary,
		borderRadius: 10,
		paddingHorizontal: 4,
		overflow: "hidden",
	},
	label: {
		color: Colors.primary,
		fontSize: 15,
		textTransform: "uppercase",
		marginBottom: 0,
	},
	inputGroup: {
		flexDirection: "row",
		alignItems: "center",
	},
	textInputIcon: {
		color: Colors.primary,
	},
	textfield: {
		backgroundColor: "#fff",
		paddingHorizontal: 8,
		paddingVertical: 5,
		width: "100%",
		fontSize: 16,
	},
	radioButtonContainer: {
		borderBottomWidth: 0,
		marginBottom: 10,
	},
	radioButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 1,
		marginVertical: 1,
		width: "50%",
	},
	radiolabel: {
		fontWeight: "bold",
		color: Colors.primary,
	},
	button: {
		marginTop: 10,
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
	inputError: {
		marginBottom: 0,
		borderColor: Colors.danger,
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
	linkBtn: {
		alignSelf: "center",
		marginVertical: 10,
		color: Colors.primary,
		fontWeight: "bold",
	},
	errorMessage: {
		alignSelf: "center",
		fontStyle: "normal",
		fontSize: 14,
	},
});
