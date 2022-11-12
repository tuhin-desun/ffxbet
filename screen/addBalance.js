import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Configs from "../config/Configs";
import Colors from "../config/colors";
import Header from "../component/Header";
import OverlayLoader from "../component/OverlayLoader";
import { addBalance } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class AddBalance extends React.Component {
	static contextType = AppContext;

	state = {
		amount: undefined,
		txnNo: "",
		txnMode: Configs.TRANSACTION_MODES[0].key,
		amountValidationErrorMsg: undefined,
		txnValidationErrorMsg: undefined,
		showLoader: false,
	};

	requestBalance = () => {
		this.setState(
			{
				amountValidationErrorMsg: undefined,
				txnValidationErrorMsg: undefined,
			},
			() => {
				let settings = this.context.appSettings;
				let { amount, txnNo } = this.state;

				if (typeof amount === "undefined") {
					this.setState({ amountValidationErrorMsg: "Enter Amount" });
				} else if (isNaN(amount) || parseFloat(amount) <= 0) {
					this.setState({ amountValidationErrorMsg: "Invalid Amount" });
				} else if (parseInt(amount) < parseInt(settings.min_deposit_amount)) {
					this.setState({
						amountValidationErrorMsg:
							"Minimum Deposit is Rs. " + parseInt(settings.min_deposit_amount),
					});
				} else if (txnNo.trim().length === 0) {
					this.setState({ txnValidationErrorMsg: "Enter Transaction No." });
				} else {
					this.setState({ showLoader: true });
					let customerData = this.context.customerData;
					let obj = {
						cust_code: customerData.cust_code,
						txn_ref_id: txnNo,
						amount: amount,
						type: this.state.txnMode,
					};

					addBalance(obj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								this.setState(
									{
										amount: undefined,
										txnNo: "",
										txnMode: Configs.TRANSACTION_MODES[0].key,
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
									showLoader: false,
									txnValidationErrorMsg: response.message,
								});
							}
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	gotoBack = () => this.props.navigation.goBack();

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Add Balance"}
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.gotoBack}
				{...this.props}
			/>
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

					<View
						style={[
							styles.inputBox,
							typeof this.state.txnValidationErrorMsg !== "undefined"
								? styles.inputError
								: null,
						]}
					>
						<Text style={styles.label}>Transaction Number</Text>
						<View style={styles.inputGroup}>
							<FontAwesome
								name="stack-exchange"
								size={18}
								style={styles.textInputIcon}
							/>
							<TextInput
								value={this.state.txnNo}
								style={styles.textfield}
								onChangeText={(txnNo) => this.setState({ txnNo })}
								placeholder="Enter Transaction Reference No."
								autoCompleteType="off"
							/>
						</View>
					</View>
					{typeof this.state.txnValidationErrorMsg !== "undefined" ? (
						<Text style={styles.errorText}>
							{this.state.txnValidationErrorMsg}
						</Text>
					) : null}

					<View style={[styles.inputBox, { borderBottomWidth: 0 }]}>
						<Text style={styles.label}>Tranfer Mode</Text>
						{Configs.TRANSACTION_MODES.map((element) => (
							<TouchableOpacity
								key={element.key}
								activeOpacity={1}
								style={styles.radioButton}
								onPress={() => this.setState({ txnMode: element.key })}
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
					</View>

					<TouchableOpacity style={styles.button} onPress={this.requestBalance}>
						<Text style={styles.textWhite}>REQUEST BALANCE</Text>
					</TouchableOpacity>
				</View>
			</View>
			<OverlayLoader visible={this.state.showLoader} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
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
});
