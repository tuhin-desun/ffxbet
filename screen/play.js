import React from "react";
import {
	StyleSheet,
	View,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	TextInput,
	FlatList,
	Alert,
	Keyboard,
} from "react-native";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import Colors from "../config/colors";
import Header from "../component/Header";
import PlayConfirmModal from "../component/PlayConfirmModal";
import SuccessModal from "../component/SuccessModal";
import OverlayLoader from "../component/OverlayLoader";
import Configs from "../config/Configs";
import { checkGameAvailability, generateCombination } from "../utils/Util";
import { addBidding,getAccountInfo,getAppSettings } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class Play extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			gameID: this.props.route.params.game_id,
			gameCode: this.props.route.params.game_code,
			gameTitle: this.props.route.params.game_title,
			slotStart: this.props.route.params.start_time,
			slotEnd: this.props.route.params.end_time,
			minumCoin: this.props.route.params.minum_coin,
			next_game_code: this.props.route.params.next_game_code,
        	is_last: this.props.route.params.is_last,
			hours: undefined,
			mins: undefined,
			activeTab: this.props.route.params.bid_type,
			digit: undefined,
			coin: undefined,
			tableData: [],
			validationFailedMessage: undefined,
			isSnackbarVisible: false,
			snackbarText: undefined,
			isConfirmModalOpen: false,
			isSuccessModalOpen: false,
			showOverlayLoader: false,
		};

		this.digitRef = React.createRef();
		this.coinRef = React.createRef();
	}

	componentDidMount = () => {
		this.updateTimer();
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			this.checkAccount(this.context.customerData.cust_code);
			getAppSettings().then((response) =>{response.game_off == '1' ? this.gotoHomeScreen() : null}).catch(err => console.log(err));
	 });
	};

	updateTimer = () => {
		this.interval = setInterval(() => {
			let mm = moment
				.duration(moment(this.state.slotEnd, "HH:mm:ss").diff(moment()))
				.asMinutes();
			mm = Math.floor(mm);

			if (mm <= 0) {
				clearInterval(this.interval);
			} else {
				this.setState({
					hours: Math.floor(mm / 60),
					mins: mm % 60,
				});
			}
		}, 1000);
	};

	componentWillUnmount = () => {
		clearInterval(this.interval);
		this._unsubscribe();
	};

	checkAccount = (customerCode) =>{
		getAccountInfo(customerCode)
		.then((response)=>{
			if(response.is_deleted == '1'){
				this.props.navigation.navigate("Logout")
			}
		})
		.catch((err)=>{ console.log(err) })
	}

	onTabChange = (tabName) =>
		this.setState({
			activeTab: tabName,
			tableData: [],
			digit: undefined,
			coin: undefined,
		});

	addTableRow = () => {
		this.setState({ validationFailedMessage: undefined });
		let { activeTab, minumCoin, digit, coin, tableData } = this.state;
		let proceed = true;

		switch (activeTab) {
			case Configs.BID_TYPE_SINGLE:
				if (
					typeof digit === "undefined" ||
					(typeof digit === "string" && digit.length === 0) ||
					isNaN(digit) ||
					parseFloat(digit) < 0 ||
					parseFloat(digit) > 9
				) {
					proceed = false;
					this.digitRef.current.focus();
					this.setState({
						validationFailedMessage: "Enter a digit between 0 to 9",
					});
				} else if (
					typeof coin === "undefined" ||
					(typeof coin === "string" && coin.length === 0)
				) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Enter coin" });
				} else if (!Number.isInteger(Number(coin))) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Coin should be a number" });
				} else if (parseFloat(coin) < parseInt(minumCoin)) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({
						validationFailedMessage:
							"Minimum coin is " + minumCoin + " to bid in this game",
					});
				} else {
					Keyboard.dismiss();
					proceed = true;
				}
				break;
			case Configs.BID_TYPE_PATTI:
				if (
					typeof digit === "undefined" ||
					(typeof digit === "string" && digit.length === 0) ||
					isNaN(digit) ||
					parseFloat(digit) < 100 ||
					parseFloat(digit) > 999
				) {
					proceed = false;
					this.digitRef.current.focus();
					this.setState({
						validationFailedMessage: "Enter a number between 100 to 999",
					});
				} else if (
					typeof coin === "undefined" ||
					(typeof coin === "string" && coin.length === 0)
				) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Enter coin" });
				} else if (parseFloat(coin) <= 0) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({
						validationFailedMessage: "Coin should be greater than 0",
					});
				} else if (!Number.isInteger(Number(coin))) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Coin should be a number" });
				} else {
					Keyboard.dismiss();
					proceed = true;
				}
				break;
			case Configs.BID_TYPE_JODI:
				if (
					typeof digit === "undefined" ||
					(typeof digit === "string" && digit.length === 0) ||
					isNaN(digit) ||
					parseFloat(digit) < 0 ||
					parseFloat(digit) > 99
				) {
					proceed = false;
					this.digitRef.current.focus();
					this.setState({
						validationFailedMessage: "Enter a number between 0 to 99",
					});
				} else if (digit.length < 2 || digit.length > 2) {
					proceed = false;
					this.digitRef.current.focus();
					this.setState({
						validationFailedMessage: "Please enter double digit",
					});
				} else if (
					typeof coin === "undefined" ||
					(typeof coin === "string" && coin.length === 0)
				) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Enter coin" });
				} else if (parseFloat(coin) <= 0) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({
						validationFailedMessage: "Coin should be greater than 0",
					});
				} else if (!Number.isInteger(Number(coin))) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Coin should be a number" });
				} else if (parseFloat(coin) < parseInt(minumCoin)) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({
						validationFailedMessage:
							"Minimum coin is " + minumCoin + " to bid in this game",
					});
				} else {
					Keyboard.dismiss();
					proceed = true;
				}
				break;
			case Configs.BID_TYPE_CP:
				if (
					typeof digit === "undefined" ||
					(typeof digit === "string" && digit.length === 0) ||
					isNaN(digit)
				) {
					proceed = false;
					this.digitRef.current.focus();
					this.setState({
						validationFailedMessage: "Enter atleast 4 digits",
					});
				} else if (digit.length < 4 || digit.length > 5) {
					proceed = false;
					this.digitRef.current.focus();
					this.setState({
						validationFailedMessage: "Please enter min 4 or 5 digit",
					});
				} else if (
					typeof coin === "undefined" ||
					(typeof coin === "string" && coin.length === 0)
				) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Enter coin" });
				} else if (parseFloat(coin) <= 0) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({
						validationFailedMessage: "Coin should be greater than 0",
					});
				} else if (!Number.isInteger(Number(coin))) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({ validationFailedMessage: "Coin should be a number" });
				} else if (parseFloat(coin) < parseInt(minumCoin)) {
					proceed = false;
					this.coinRef.current.focus();
					this.setState({
						validationFailedMessage:
							"Minimum coin is " + minumCoin + " to bid in this game",
					});
				} else {
					Keyboard.dismiss();
					proceed = true;
				}
				break;
			default:
				break;
		}

		let index = (tableData || []).findIndex(
			(element) => parseInt(element.digit) === parseInt(digit)
		);
		if (index > -1) {
			proceed = false;
			this.digitRef.current.focus();
			this.setState({
				validationFailedMessage: "Digit " + digit + " is alreday added.",
			});
		}

		if (proceed) {
			let data = [];

			if (this.state.activeTab === Configs.BID_TYPE_CP) {
				let combination = generateCombination(digit, 3);
				combination.map((d, i) => {
					data.push({
						id: i,
						digit: d,
						coin: coin,
					});
				})
			} else {
				data = tableData;
				data.push({
					id: Date.now(),
					digit: digit,
					coin: coin,
				});
			}


			this.setState({
				tableData: data,
				digit: undefined,
				coin: undefined,
			});
		}
	};

	deleteItemById = (id) => {
		let filteredData = this.state.tableData.filter((item) => item.id !== id);
		this.setState({ tableData: filteredData });
	};

	deleteAlert = (id) => {
		Alert.alert("Remove Item!", "Are you sure you want to remove this item.", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{ text: "OK", onPress: () => this.deleteItemById(id) },
		]);
	};

	renderRow = ({ item }) => {
		return (
			<View style={styles.tableRow}>
				<Text style={styles.tableText}>{item.digit}</Text>
				<Text style={styles.tableText}>{item.coin}</Text>
				{this.state.activeTab !== Configs.BID_TYPE_CP ? (
					<TouchableOpacity
						style={{ padding: 1 }}
						onPress={this.deleteAlert.bind(this, item.id)}
					>
						<MaterialCommunityIcons name="delete" size={27} color="red" />
					</TouchableOpacity>
				) :
					<TouchableOpacity
						style={{ padding: 1 }}
					>
						<Text>{" "}</Text>
					</TouchableOpacity>
				}
			</View>
		);
	};

	tableFooterComponent = () =>
		this.state.tableData.length > 0 ? (
			<TouchableOpacity
				style={[styles.button, { marginVertical: 15 }]}
				onPress={this.playNow}
			>
				<Text style={styles.textWhite}>PLAY NOW</Text>
			</TouchableOpacity>
		) : null;

	getTotalAmount = () => {
		let amount = 0;
		let { tableData } = this.state;
		tableData.forEach((v, i) => {
			amount += parseInt(v.coin);
		});
		return amount;
	};

	toggleConfirmModal = () =>
		this.setState({ isConfirmModalOpen: !this.state.isConfirmModalOpen });

	onDismissSnackBar = () =>
		this.setState({
			isSnackbarVisible: false,
			snackbarText: undefined,
		});

	playNow = () => {
		let walletAmount = this.context.customerData.amount;
		let totalAmount = this.getTotalAmount();

		if (parseInt(totalAmount) <= parseInt(walletAmount)) {
			this.setState({ isConfirmModalOpen: true });
		} else {
			this.setState({
				isSnackbarVisible: true,
				snackbarText: "Insufficient Wallet Balance!",
			});
		}
	};

	cleanDigit = (value) => {
		const cleanNumbers = value.replace(/[^0-9]/g, "");
		this.setState({
			digit: cleanNumbers
		})
	}

	cleanCoin = (value) => {
		const cleanNumbers = value.replace(/[^0-9]/g, "");
		this.setState({
			coin: cleanNumbers
		})
	}

	submitBid = () => {
		let { customerData } = this.context;
		let { slotStart, slotEnd, tableData } = this.state;
		let isGameAvailable = checkGameAvailability(slotStart, slotEnd);
		// let isGameAvailable = true;

		if (isGameAvailable) {
			this.setState(
				{
					isConfirmModalOpen: false,
					showOverlayLoader: true,
				},
				() => {
					let bidData = [];
					tableData.forEach((v, i) => {
						bidData.push({
							number: v.digit,
							amount: v.coin,
						});
					});

					let obj = {
						cust_code: customerData.cust_code,
						game_code: this.state.gameCode,
						type: this.state.activeTab,
						bid_data: JSON.stringify(bidData),
					};

					if(this.state.activeTab == Configs.BID_TYPE_JODI){
						obj = {
							cust_code: customerData.cust_code,
							game_code: this.state.next_game_code,
							type: this.state.activeTab,
							bid_data: JSON.stringify(bidData),
						};
					}
					
					addBidding(obj).then((response) => {
						if (response.check === Configs.SUCCESS_TYPE) {
							let updatedBalance =
								parseInt(customerData.amount) - this.getTotalAmount();
							customerData.amount = updatedBalance;
							this.context.setCustomerData(customerData);

							this.setState({
								isSnackbarVisible: false,
								snackbarText: undefined,
								showOverlayLoader: false,
								isSuccessModalOpen: true,
							});
						} else {
							this.setState({
								showOverlayLoader: false,
								isSnackbarVisible: true,
								snackbarText: response.message,
							});
						}
					});
				}
			);
		} else {
			this.setState({
				isConfirmModalOpen: false,
				isSnackbarVisible: true,
				snackbarText: "Game has been closed!",
			});
		}
	};

	gotoHomeScreen = () =>
		this.setState(
			{
				tableData: [],
				isSuccessModalOpen: false,
			},
			() => {
				this.props.navigation.navigate("Home");
			}
		);

	gotoBack = () => this.props.navigation.goBack();

	render = () => (
		<View style={styles.container}>
			<Header
				title={this.state.gameTitle}
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.gotoBack}
				{...this.props}
			/>

			<View style={styles.titleTimerContainer}>
				<Text style={styles.gameTitle}>
					{this.state.gameTitle + " closed in"}
				</Text>
				<View style={styles.timerContainer}>
					{typeof this.state.hours !== "undefined" ? (
						<>
							<MaterialCommunityIcons
								name="clock"
								size={24}
								color={Colors.primary}
							/>
							<Text style={styles.timerText}>
								{this.state.hours + " Hr " + this.state.mins + " min"}
							</Text>
						</>
					) : (
						<>
							<Text style={styles.loaderText}>Loading... </Text>
							<ActivityIndicator size="small" color={Colors.primary} />
						</>
					)}
				</View>
			</View>

			{/* <View style={styles.tabBar}>
				<View style={styles.tab}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={this.onTabChange.bind(this, Configs.BID_TYPE_SINGLE)}
						style={
							this.state.activeTab === Configs.BID_TYPE_SINGLE
								? styles.activeTabStyle
								: styles.tabStyle
						}
					>
						<Text
							style={
								this.state.activeTab === Configs.BID_TYPE_SINGLE
									? styles.activeTabTextStyle
									: styles.tabTextStyle
							}
						>
							Single
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.tab}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={this.onTabChange.bind(this, Configs.BID_TYPE_PATTI)}
						style={
							this.state.activeTab === Configs.BID_TYPE_PATTI
								? styles.activeTabStyle
								: styles.tabStyle
						}
					>
						<Text
							style={
								this.state.activeTab === Configs.BID_TYPE_PATTI
									? styles.activeTabTextStyle
									: styles.tabTextStyle
							}
						>
							Patti
						</Text>
					</TouchableOpacity>
				</View>
			</View> */}

			<View style={styles.inputContainer}>
				<View style={styles.inputBox}>
					<TextInput
						ref={this.digitRef}
						value={this.state.digit}
						onChangeText={(digit) => this.cleanDigit(digit)}
						style={styles.textfield}
						placeholder="Enter digit"
						keyboardType="numeric"
						autoCompleteType="off"
						maxLength={this.state.activeTab === Configs.BID_TYPE_SINGLE ? 1 :
							this.state.activeTab === Configs.BID_TYPE_CP ? 5 : this.state.activeTab === Configs.BID_TYPE_JODI ? 2 : 3}
					/>
				</View>
				<View style={styles.inputBox}>
					<TextInput
						ref={this.coinRef}
						value={this.state.coin}
						onChangeText={(coin) => this.cleanCoin(coin)}
						style={styles.textfield}
						placeholder="Enter Coin"
						keyboardType="numeric"
						autoCompleteType="off"
					/>
				</View>
			</View>

			{typeof this.state.validationFailedMessage !== "undefined" ? (
				<Text style={styles.textDanger}>
					{this.state.validationFailedMessage}
				</Text>
			) : null}

			<TouchableOpacity
				activeOpacity={0.9}
				style={styles.button}
				onPress={this.addTableRow}
			>
				<Text style={styles.textWhite}>ADD BET</Text>
			</TouchableOpacity>

			<View style={styles.tableHead}>
				<Text style={styles.tableHeading}>{this.state.activeTab}</Text>
				<Text style={styles.tableHeading}>Coin</Text>
				<Text style={styles.tableHeading}>Action</Text>
			</View>

			<FlatList
				style={{ flex: 1 }}
				data={this.state.tableData}
				renderItem={this.renderRow}
				keyExtractor={(item) => item.id.toString()}
				showsVerticalScrollIndicator={false}
				initialNumToRender={this.state.tableData.length}
				ListFooterComponent={this.tableFooterComponent()}
			/>

			<PlayConfirmModal
				visible={this.state.isConfirmModalOpen}
				onClose={this.toggleConfirmModal}
				onSubmit={this.submitBid}
			>
				<View style={styles.descContainer}>
					<View style={styles.descRow}>
						<Text style={styles.descText}>Current Wallet Balance</Text>
						<Text style={styles.descText}>
							{"Rs: "}
							{this.context.customerData !== null
								? parseInt(this.context.customerData.amount)
								: 0}
						</Text>
					</View>
					<View style={styles.descRow}>
						<Text style={styles.descText}>Total Amount For Play</Text>
						<Text style={styles.descText}>
							{"Rs: " + this.getTotalAmount()}
						</Text>
					</View>
					<View style={styles.descRow}>
						<Text style={styles.descText}>After Play Wallet Balance</Text>
						<Text style={styles.descText}>
							{"Rs: "}
							{parseInt(
								this.context.customerData !== null
									? this.context.customerData.amount
									: 0
							) - this.getTotalAmount()}
						</Text>
					</View>
				</View>
			</PlayConfirmModal>

			<SuccessModal
				visible={this.state.isSuccessModalOpen}
				onSubmit={this.gotoHomeScreen}
			/>

			<Snackbar
				duration={3000}
				visible={this.state.isSnackbarVisible}
				onDismiss={this.onDismissSnackBar}
				style={{ backgroundColor: Colors.danger }}
			>
				{this.state.snackbarText}
			</Snackbar>

			<OverlayLoader visible={this.state.showOverlayLoader} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	titleTimerContainer: {
		flexDirection: "row",
		height: 50,
		backgroundColor: Colors.secondary,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 18,
	},
	gameTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.primary,
	},
	timerContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	timerText: {
		paddingLeft: 10,
		color: Colors.primary,
		fontSize: 20,
	},
	loaderText: {
		fontSize: 16,
		color: Colors.primary,
	},
	tabBar: {
		flexDirection: "row",
		height: 50,
		backgroundColor: Colors.primary,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 18,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	tabStyle: {
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 15,
	},
	activeTabStyle: {
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderBottomWidth: 4,
		borderBottomColor: Colors.secondary,
		paddingHorizontal: 15,
	},
	tabTextStyle: {
		color: Colors.white,
		fontSize: 18,
	},
	activeTabTextStyle: {
		color: Colors.secondary,
		fontWeight: "bold",
		fontSize: 18,
	},
	inputContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginVertical: 12,
	},
	inputBox: {
		position: "relative",
		width: "40%",
	},
	textfield: {
		backgroundColor: "white",
		borderColor: Colors.primary,
		borderRadius: 10,
		borderWidth: 2,
		paddingBottom: 10,
		paddingTop: 10,
		textAlign: "center",
	},
	button: {
		alignSelf: "center",
		alignItems: "center",
		backgroundColor: Colors.secondary,
		width: "50%",
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
	tableHead: {
		flexDirection: "row",
		backgroundColor: Colors.primary,
		height: 50,
		marginTop: 15,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
	},
	tableHeading: {
		fontWeight: "bold",
		fontSize: 16,
		color: Colors.secondary,
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		paddingVertical: 8,
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightGrey,
	},
	tableText: {
		fontSize: 16,
		textAlign: "justify",
	},
	textDanger: {
		textAlign: "center",
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.danger,
		marginBottom: 12,
	},
	descContainer: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		width: "100%",
	},
	descRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: 8,
	},
	descText: {
		fontSize: 16,
		color: "#444",
	},
});
