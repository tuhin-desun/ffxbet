import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	TextInput,
	ScrollView,
	Modal,
	ToastAndroid,
	ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../component/Header";
import OverlayLoader from "../component/OverlayLoader";
import { editProfile, getAccountInfo } from "../services/APIServices";
import { writeCustomerData } from "../utils/Util";
import AppContext from "../context/AppContext";

export default class UpdateAccount extends React.Component {
	static contextType = AppContext;

	state = {
		fullName: "",
		newPassword: "",
		confirmPassword: "",
		fullNameValidationError: undefined,
		newPasswordValidationError: undefined,
		confirmPasswordValidationError: undefined,
		bankDetails: false,
		paytm: false,
		googlePay: false,
		phonePe: false,
		upi: false,
		modalVisible: false,
		isNameChangeFormOpen: false,
		isPasswordChangeFormOpen: false,
		accountNo: "",
		bankName: "",
		ifscCode: "",
		branchName: "",
		accountHolderName: "",
		paytmNo: "",
		googlePayNo: "",
		phonePeNo: "",
		upiID: "",
		accountNoValidationFailed: false,
		bankNameValidationFailed: false,
		ifscCodeValidationFailed: false,
		branchNameValidationFailed: false,
		accountHolderNameValidationFailed: false,
		paytmValidationFailed: false,
		googlePayValidationFailed: false,
		phonePeValidationFailed: false,
		upiValidationFailed: false,
		showLoader: true,
		isSubmitting: false,
	};

	componentDidMount = () => {
		const { customerData } = this.context;

		getAccountInfo(customerData.cust_code)
			.then((data) => {
				this.setState({
					accountNo: data.acc_number !== null ? data.acc_number : "",
					bankName: data.bank_name !== null ? data.bank_name : "",
					ifscCode: data.ifsc_code !== null ? data.ifsc_code : "",
					branchName: data.branch !== null ? data.branch : "",
					accountHolderName: data.ac_holder !== null ? data.ac_holder : "",
					paytmNo: data.paytm_number !== null ? data.paytm_number : "",
					googlePayNo: data.gpay_number !== null ? data.gpay_number : "",
					phonePeNo: data.phonepay_number !== null ? data.phonepay_number : "",
					upiID: data.upi !== null ? data.upi : "",
					fullName: customerData.full_name,
					showLoader: false,
				});
			})
			.catch((error) => console.log(error));
	};

	goBack = () => this.props.navigation.navigate("Home");

	hideModal = () =>
		this.setState({
			modalVisible: false,
			isNameChangeFormOpen: false,
			isPasswordChangeFormOpen: false,
			newPassword: "",
			confirmPassword: "",
			fullNameValidationError: undefined,
			newPasswordValidationError: undefined,
			confirmPasswordValidationError: undefined,
		});

	openNameChangeForm = () =>
		this.setState({
			modalVisible: true,
			isNameChangeFormOpen: true,
			isPasswordChangeFormOpen: false,
		});

	openPasswordChangeForm = () =>
		this.setState({
			modalVisible: true,
			isNameChangeFormOpen: false,
			isPasswordChangeFormOpen: true,
		});

	toggleAccordion = (currentAccordion) => {
		this.setState({
			bankDetails:
				currentAccordion === "bankDetails" ? !this.state.bankDetails : false,
			paytm: currentAccordion === "paytm" ? !this.state.paytm : false,
			googlePay:
				currentAccordion === "googlePay" ? !this.state.googlePay : false,
			phonePe: currentAccordion === "phonePe" ? !this.state.phonePe : false,
			upi: currentAccordion === "upi" ? !this.state.upi : false,
		});
	};

	saveName = () => {
		this.setState(
			{
				fullNameValidationError: undefined,
			},
			() => {
				let { fullName } = this.state;
				if (fullName.trim().length === 0 || !isNaN(fullName)) {
					this.setState({ fullNameValidationError: "Enter Your Name" });
				} else {
					this.setState({ showLoader: true });
					let customerData = this.context.customerData;
					let obj = {
						cust_code: customerData.cust_code,
						full_name: fullName,
					};

					editProfile(obj).then((response) => {
						customerData.full_name = fullName;
						this.context.setCustomerData(customerData);
						writeCustomerData(customerData);
						this.setState(
							{
								showLoader: false,
							},
							() => {
								this.hideModal();
								ToastAndroid.show(response.message, ToastAndroid.SHORT);
							}
						);
					});
				}
			}
		);
	};

	changePassword = () => {
		this.setState(
			{
				newPasswordValidationError: undefined,
				confirmPasswordValidationError: undefined,
			},
			() => {
				let { newPassword, confirmPassword } = this.state;
				if (newPassword.trim().length === 0) {
					this.setState({
						newPasswordValidationError: "Enter your new password",
					});
				} else if (
					newPassword.trim().length > 0 &&
					newPassword.trim().length < 6
				) {
					this.setState({
						newPasswordValidationError:
							"Password contain atleast 6th character",
					});
				} else if (newPassword !== confirmPassword) {
					this.setState({
						confirmPasswordValidationError: "Confirm password does not match",
					});
				} else {
					this.setState({ showLoader: true });
					let obj = {
						cust_code: this.context.customerData.cust_code,
						password: newPassword,
					};

					editProfile(obj).then((response) => {
						this.setState(
							{
								showLoader: false,
							},
							() => {
								this.hideModal();
								ToastAndroid.show(response.message, ToastAndroid.SHORT);
							}
						);
					});
				}
			}
		);
	};

	saveBankDetails = () => {
		this.setState(
			{
				accountNoValidationFailed: false,
				bankNameValidationFailed: false,
				ifscCodeValidationFailed: false,
				branchNameValidationFailed: false,
				accountHolderNameValidationFailed: false,
			},
			() => {
				let { accountNo, bankName, ifscCode, branchName, accountHolderName } =
					this.state;

				if (accountNo.trim().length === 0) {
					this.setState({ accountNoValidationFailed: true });
				} else if (bankName.trim().length === 0) {
					this.setState({ bankNameValidationFailed: true });
				} else if (ifscCode.trim().length === 0) {
					this.setState({ ifscCodeValidationFailed: true });
				} else if (branchName.trim().length === 0) {
					this.setState({ branchNameValidationFailed: true });
				} else if (accountHolderName.trim().length === 0) {
					this.setState({ accountHolderNameValidationFailed: true });
				} else {
					this.setState({ isSubmitting: true });
					let obj = {
						cust_code: this.context.customerData.cust_code,
						acc_number: accountNo,
						bank_name: bankName,
						ifsc_code: ifscCode,
						branch: branchName,
						ac_holder: accountHolderName,
					};

					editProfile(obj).then((response) => {
						this.setState(
							{
								isSubmitting: false,
							},
							() => {
								ToastAndroid.show(response.message, ToastAndroid.SHORT);
							}
						);
					});
				}
			}
		);
	};

	savePaytmDetails = () => {
		this.setState(
			{
				paytmValidationFailed: false,
			},
			() => {
				let { paytmNo } = this.state;
				if (
					paytmNo.trim().length === 0 ||
					(paytmNo.trim().length > 0 && paytmNo.trim().length < 10)
				) {
					this.setState({
						paytmNo: "",
						paytmValidationFailed: true,
					});
				} else {
					this.setState({ isSubmitting: true });
					let obj = {
						cust_code: this.context.customerData.cust_code,
						paytm_number: paytmNo,
					};

					editProfile(obj).then((response) => {
						this.setState(
							{
								isSubmitting: false,
							},
							() => {
								ToastAndroid.show(response.message, ToastAndroid.SHORT);
							}
						);
					});
				}
			}
		);
	};

	saveGooglePayDetails = () => {
		this.setState(
			{
				googlePayValidationFailed: false,
			},
			() => {
				let { googlePayNo } = this.state;
				if (
					googlePayNo.trim().length === 0 ||
					(googlePayNo.trim().length > 0 && googlePayNo.trim().length < 10)
				) {
					this.setState({
						googlePayNo: "",
						googlePayValidationFailed: true,
					});
				} else {
					this.setState({ isSubmitting: true });
					let obj = {
						cust_code: this.context.customerData.cust_code,
						gpay_number: googlePayNo,
					};

					editProfile(obj).then((response) => {
						this.setState(
							{
								isSubmitting: false,
							},
							() => {
								ToastAndroid.show(response.message, ToastAndroid.SHORT);
							}
						);
					});
				}
			}
		);
	};

	savePhonePeDetails = () => {
		this.setState(
			{
				phonePeValidationFailed: false,
			},
			() => {
				let { phonePeNo } = this.state;
				if (
					phonePeNo.trim().length === 0 ||
					(phonePeNo.trim().length > 0 && phonePeNo.trim().length < 10)
				) {
					this.setState({
						phonePeNo: "",
						phonePeValidationFailed: true,
					});
				} else {
					this.setState({ isSubmitting: true });
					let obj = {
						cust_code: this.context.customerData.cust_code,
						phonepay_number: phonePeNo,
					};

					editProfile(obj).then((response) => {
						this.setState(
							{
								isSubmitting: false,
							},
							() => {
								ToastAndroid.show(response.message, ToastAndroid.SHORT);
							}
						);
					});
				}
			}
		);
	};

	saveUPIDetails = () => {
		this.setState(
			{
				upiValidationFailed: false,
			},
			() => {
				let { upiID } = this.state;
				if (upiID.trim().length === 0) {
					this.setState({
						upiID: "",
						upiValidationFailed: true,
					});
				} else {
					this.setState({ isSubmitting: true });
					let obj = {
						cust_code: this.context.customerData.cust_code,
						upi: upiID,
					};

					editProfile(obj).then((response) => {
						this.setState(
							{
								isSubmitting: false,
							},
							() => {
								ToastAndroid.show(response.message, ToastAndroid.SHORT);
							}
						);
					});
				}
			}
		);
	};

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Update Account"}
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.goBack}
				{...this.props}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.box}>
					<View style={styles.boxHead}>
						<Text style={styles.boxHeadText}>PERSONAL INFO</Text>
					</View>
					{this.context.customerData !== null ? (
						<View style={styles.boxContentPersonal}>
							<View style={styles.boxItemName}>
								<Text style={styles.boxContentTextName}>Name</Text>

								<TouchableOpacity
									style={{ flexDirection: "row" }}
									onPress={this.openNameChangeForm}
								>
									<Text style={[styles.boxContentTextName, { marginRight: 5 }]}>
										{this.context.customerData.full_name}
									</Text>
									<FontAwesome
										name="pencil"
										size={16}
										color={Colors.primary}
										style={{ alignSelf: "center" }}
									/>
								</TouchableOpacity>
							</View>
							<View style={styles.boxItemName}>
								<Text style={styles.boxContentTextName}>Phone</Text>
								<Text style={styles.boxContentTextName}>
									{"+91 " + this.context.customerData.mobile}
								</Text>
							</View>
						</View>
					) : null}

					<TouchableOpacity
						activeOpacity={1}
						style={styles.btn}
						onPress={this.openPasswordChangeForm}
					>
						<Text style={styles.btnText}>Change Password</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.box}>
					<View style={styles.boxHead}>
						<Text style={styles.boxHeadText}>ACCOUNT INFO</Text>
					</View>
					<View style={styles.boxContent}>
						<View style={styles.boxItem}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.itmHead}
								onPress={this.toggleAccordion.bind(this, "bankDetails")}
							>
								<Text style={styles.boxContentText}>Add Bank Details</Text>
							</TouchableOpacity>
							{this.state.bankDetails ? (
								<View style={styles.inputBox}>
									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>Account No</Text>
										<TextInput
											value={this.state.accountNo}
											style={styles.textfield}
											onChangeText={(accountNo) => this.setState({ accountNo })}
											autoCompleteType="off"
											keyboardType="numeric"
											placeholder="Enter Account Number"
											placeholderTextColor={
												this.state.accountNoValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>

									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>Bank Name</Text>
										<TextInput
											value={this.state.bankName}
											style={styles.textfield}
											onChangeText={(bankName) => this.setState({ bankName })}
											autoCompleteType="off"
											autoCapitalize="words"
											placeholder="Enter Bank Name"
											placeholderTextColor={
												this.state.bankNameValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>

									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>IFSC Code</Text>
										<TextInput
											value={this.state.ifscCode}
											style={[styles.textfield]}
											onChangeText={(ifscCode) => this.setState({ ifscCode })}
											autoCompleteType="off"
											autoCapitalize="characters"
											placeholder="Enter IFSC Code"
											placeholderTextColor={
												this.state.ifscCodeValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>

									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>Branch Name</Text>
										<TextInput
											value={this.state.branchName}
											style={styles.textfield}
											onChangeText={(branchName) =>
												this.setState({ branchName })
											}
											autoCompleteType="off"
											autoCapitalize="words"
											placeholder="Enter Branch Name"
											placeholderTextColor={
												this.state.branchNameValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>

									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>A/C Holder</Text>
										<TextInput
											value={this.state.accountHolderName}
											style={styles.textfield}
											onChangeText={(accountHolderName) =>
												this.setState({ accountHolderName })
											}
											autoCompleteType="off"
											autoCapitalize="words"
											placeholder="Ente Account Holder Name"
											placeholderTextColor={
												this.state.accountHolderNameValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>

									<TouchableOpacity
										activeOpacity={this.state.isSubmitting ? 1 : 0.9}
										onPress={
											this.state.isSubmitting ? undefined : this.saveBankDetails
										}
										style={styles.button}
									>
										{this.state.isSubmitting ? (
											<>
												<Text style={styles.textWhite}>Loading...</Text>
												<ActivityIndicator
													size="small"
													color={Colors.primary}
												/>
											</>
										) : (
											<Text style={styles.textWhite}>Save</Text>
										)}
									</TouchableOpacity>
								</View>
							) : null}
						</View>

						<View style={styles.boxItem}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.itmHead}
								onPress={this.toggleAccordion.bind(this, "paytm")}
							>
								<Text style={styles.boxContentText}>Add Paytm Number</Text>
							</TouchableOpacity>
							{this.state.paytm ? (
								<View style={styles.inputBox}>
									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>Paytm No</Text>
										<TextInput
											value={this.state.paytmNo}
											maxLength={10}
											style={styles.textfield}
											onChangeText={(paytmNo) => this.setState({ paytmNo })}
											placeholder="Enter Paytm Number"
											keyboardType="numeric"
											autoCompleteType="off"
											placeholderTextColor={
												this.state.paytmValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>
									<TouchableOpacity
										activeOpacity={this.state.isSubmitting ? 1 : 0.9}
										onPress={
											this.state.isSubmitting
												? undefined
												: this.savePaytmDetails
										}
										style={styles.button}
									>
										{this.state.isSubmitting ? (
											<>
												<Text style={styles.textWhite}>Loading...</Text>
												<ActivityIndicator
													size="small"
													color={Colors.primary}
												/>
											</>
										) : (
											<Text style={styles.textWhite}>Save</Text>
										)}
									</TouchableOpacity>
								</View>
							) : null}
						</View>

						<View style={styles.boxItem}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.itmHead}
								onPress={this.toggleAccordion.bind(this, "googlePay")}
							>
								<Text style={styles.boxContentText}>Add Google Pay Number</Text>
							</TouchableOpacity>
							{this.state.googlePay ? (
								<View style={styles.inputBox}>
									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>Google Pay No</Text>
										<TextInput
											value={this.state.googlePayNo}
											maxLength={10}
											style={styles.textfield}
											onChangeText={(googlePayNo) =>
												this.setState({ googlePayNo })
											}
											placeholder="Enter Google Pay Number"
											keyboardType="numeric"
											autoCompleteType="off"
											placeholderTextColor={
												this.state.googlePayValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>
									<TouchableOpacity
										activeOpacity={this.state.isSubmitting ? 1 : 0.9}
										onPress={
											this.state.isSubmitting
												? undefined
												: this.saveGooglePayDetails
										}
										style={styles.button}
									>
										{this.state.isSubmitting ? (
											<>
												<Text style={styles.textWhite}>Loading...</Text>
												<ActivityIndicator
													size="small"
													color={Colors.primary}
												/>
											</>
										) : (
											<Text style={styles.textWhite}>Save</Text>
										)}
									</TouchableOpacity>
								</View>
							) : null}
						</View>

						<View style={styles.boxItem}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.itmHead}
								onPress={this.toggleAccordion.bind(this, "phonePe")}
							>
								<Text style={styles.boxContentText}>Add Phone Pay Number</Text>
							</TouchableOpacity>
							{this.state.phonePe ? (
								<View style={styles.inputBox}>
									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>Phone Pay No</Text>
										<TextInput
											value={this.state.phonePeNo}
											maxLength={10}
											style={styles.textfield}
											onChangeText={(phonePeNo) => this.setState({ phonePeNo })}
											placeholder="Enter PhonePe Number"
											keyboardType="numeric"
											autoCompleteType="off"
											placeholderTextColor={
												this.state.phonePeValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>
									<TouchableOpacity
										activeOpacity={this.state.isSubmitting ? 1 : 0.9}
										onPress={
											this.state.isSubmitting
												? undefined
												: this.savePhonePeDetails
										}
										style={styles.button}
									>
										{this.state.isSubmitting ? (
											<>
												<Text style={styles.textWhite}>Loading...</Text>
												<ActivityIndicator
													size="small"
													color={Colors.primary}
												/>
											</>
										) : (
											<Text style={styles.textWhite}>Save</Text>
										)}
									</TouchableOpacity>
								</View>
							) : null}
						</View>

						<View style={styles.boxItem}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.itmHead}
								onPress={this.toggleAccordion.bind(this, "upi")}
							>
								<Text style={styles.boxContentText}>Add UPI Deatils</Text>
							</TouchableOpacity>
							{this.state.upi ? (
								<View style={styles.inputBox}>
									<View style={styles.inputBoxRow}>
										<Text style={styles.label}>UPI ID</Text>
										<TextInput
											value={this.state.upiID}
											onChangeText={(upiID) => this.setState({ upiID })}
											style={styles.textfield}
											placeholder="Enter UPI ID"
											autoCompleteType="off"
											autoCapitalize="none"
											placeholderTextColor={
												this.state.upiValidationFailed
													? Colors.danger
													: undefined
											}
										/>
									</View>
									<TouchableOpacity
										activeOpacity={this.state.isSubmitting ? 1 : 0.9}
										onPress={
											this.state.isSubmitting ? undefined : this.saveUPIDetails
										}
										style={styles.button}
									>
										{this.state.isSubmitting ? (
											<>
												<Text style={styles.textWhite}>Loading...</Text>
												<ActivityIndicator
													size="small"
													color={Colors.primary}
												/>
											</>
										) : (
											<Text style={styles.textWhite}>Save</Text>
										)}
									</TouchableOpacity>
								</View>
							) : null}
						</View>
					</View>
				</View>
			</ScrollView>

			<Modal
				visible={this.state.modalVisible}
				animationType="none"
				transparent={true}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalBody}>
						{this.state.isNameChangeFormOpen ? (
							<>
								<View
									style={[
										styles.modalInputBox,
										typeof this.state.fullNameValidationError !== "undefined"
											? styles.modalInputError
											: null,
									]}
								>
									<Text style={styles.modalInputLabel}>Name</Text>
									<TextInput
										value={this.state.fullName}
										style={styles.modalTextfield}
										onChangeText={(fullName) => this.setState({ fullName })}
										placeholder="Enter Name"
										autoCompleteType="off"
										autoCapitalize="words"
									/>
								</View>
								{typeof this.state.fullNameValidationError !== "undefined" ? (
									<Text style={styles.modalInputErrorText}>
										{this.state.fullNameValidationError}
									</Text>
								) : null}
							</>
						) : (
							<>
								<View
									style={[
										styles.modalInputBox,
										typeof this.state.newPasswordValidationError !== "undefined"
											? styles.modalInputError
											: null,
									]}
								>
									<Text style={styles.modalInputLabel}>New Password</Text>
									<TextInput
										value={this.state.newPassword}
										style={styles.modalTextfield}
										onChangeText={(newPassword) =>
											this.setState({ newPassword })
										}
										placeholder="Enter New Password"
										autoCompleteType="off"
									/>
								</View>
								{typeof this.state.newPasswordValidationError !==
								"undefined" ? (
									<Text style={styles.modalInputErrorText}>
										{this.state.newPasswordValidationError}
									</Text>
								) : null}

								<View
									style={[
										styles.modalInputBox,
										typeof this.state.confirmPasswordValidationError !==
										"undefined"
											? styles.modalInputError
											: null,
									]}
								>
									<Text style={styles.modalInputLabel}>Confirm Password</Text>
									<TextInput
										value={this.state.confirmPassword}
										style={styles.modalTextfield}
										onChangeText={(confirmPassword) =>
											this.setState({ confirmPassword })
										}
										placeholder="Enter Confirm Password"
										autoCompleteType="off"
										secureTextEntry={true}
									/>
								</View>
								{typeof this.state.confirmPasswordValidationError !==
								"undefined" ? (
									<Text style={styles.modalInputErrorText}>
										{this.state.confirmPasswordValidationError}
									</Text>
								) : null}
							</>
						)}

						<View style={styles.modalFooter}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={
									this.state.isNameChangeFormOpen
										? this.saveName
										: this.changePassword
								}
								style={[styles.modalBtn, { backgroundColor: Colors.primary }]}
							>
								<Text style={{ color: "#FFF" }}>Save</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={1}
								onPress={this.hideModal}
								style={[styles.modalBtn, { backgroundColor: Colors.secondary }]}
							>
								<Text style={{ color: "#FFF" }}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<OverlayLoader visible={this.state.showLoader} />
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	label: {
		fontSize: 14,
		width: "30%",
	},
	inputBox: {
		backgroundColor: Colors.primary,
		borderRadius: 10,
		marginHorizontal: 3,
	},

	inputBoxRow: {
		marginHorizontal: 2,
		marginVertical: 2,
		paddingLeft: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: Colors.background,
		borderRadius: 5,
	},
	textfield: {
		backgroundColor: "#fff",
		width: "70%",
		paddingVertical: 7,
		paddingHorizontal: 5,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
	},
	button: {
		flexDirection: "row",
		marginVertical: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.secondary,
		paddingVertical: 12,
		marginHorizontal: 2,
		borderRadius: 5,
	},
	textWhite: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	box: {
		backgroundColor: Colors.white,
		marginHorizontal: 5,
		marginVertical: 5,
		borderWidth: 2,
		borderColor: Colors.secondary,
	},
	boxHead: {
		backgroundColor: Colors.secondary,
		paddingVertical: 10,
		paddingLeft: 10,
	},
	boxHeadText: {
		fontWeight: "bold",
		fontSize: 20,
	},
	boxContent: {
		paddingVertical: 5,
	},

	boxItemName: {
		marginHorizontal: 10,
		paddingVertical: 10,
		flexDirection: "row",
	},
	boxContentText: {
		color: Colors.white,
		fontWeight: "bold",
		fontSize: 16,
	},
	boxContentTextName: {
		fontWeight: "bold",
		fontSize: 16,
		marginRight: 30,
	},
	boxItem: {
		backgroundColor: Colors.primary,
		borderRadius: 10,
		marginHorizontal: 5,
		marginVertical: 5,
	},
	itmHead: {
		backgroundColor: Colors.primary,
		alignItems: "center",
		borderRadius: 10,
		paddingVertical: 15,
	},
	btn: {
		flexDirection: "row",
		marginLeft: 10,
		marginVertical: 10,
		paddingVertical: 6,
		backgroundColor: Colors.primary,
		width: 120,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
	},
	btnText: {
		color: Colors.white,
		fontSize: 13,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 5,
	},
	modalBody: {
		backgroundColor: Colors.white,
		width: "100%",
		padding: 15,
		borderRadius: 3,
	},
	modalFooter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	modalInputBox: {
		position: "relative",
		marginBottom: 20,
		borderBottomWidth: 2,
		borderColor: Colors.primary,
		borderRadius: 10,
		paddingHorizontal: 4,
		overflow: "hidden",
	},
	modalInputLabel: {
		color: Colors.primary,
		fontSize: 15,
		textTransform: "uppercase",
		marginBottom: 0,
	},
	modalTextfield: {
		backgroundColor: "#fff",
		paddingVertical: 8,
		width: "100%",
		fontSize: 16,
	},
	modalInputError: {
		marginBottom: 0,
		borderColor: Colors.danger,
	},
	modalInputErrorText: {
		color: Colors.danger,
		fontStyle: "italic",
		fontSize: 13,
		fontWeight: "bold",
		alignSelf: "flex-end",
		marginBottom: 20,
		marginRight: 5,
	},
	modalBtn: {
		width: 60,
		height: 35,
		marginHorizontal: 5,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 3,
	},
});
