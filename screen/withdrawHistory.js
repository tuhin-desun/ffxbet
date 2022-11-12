import * as React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../component/Header";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import { getWithdrawHistory } from "../services/APIServices";
import AppContext from "../context/AppContext";
import Configs from "../config/Configs";

export default class WithdrawHistory extends React.Component {
	static contextType = AppContext;

	state = {
		withdrawHistory: [],
		isLoading: true,
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
		this.setState(
			{
				withdrawHistory: [],
				isLoading: true,
			},
			() => {
				this.loadWithdrawHistory();
			}
		);
	};

	loadWithdrawHistory = () => {
		let customerCode = this.context.customerData.cust_code;
		getWithdrawHistory(customerCode)
			.then((data) => {
				this.setState({
					withdrawHistory: data,
					isLoading: false,
				});
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadWithdrawHistory();
			}
		);
	};

	goBack = () => this.props.navigation.goBack();

	renderBox = ({ item }) => {
		return (
			<View style={styles.box}>
				<View style={styles.boxHead}>
					<Text style={styles.boxHeadText}>
						{moment(item.date, "YYYY-MM-DD").format("Do MMM, YYYY")}
					</Text>
				</View>
				{item.data.map((element) => {
					let status = Configs.ADD_BALANCE_STATUS[element.status];
					return (
						<View style={styles.tableRow} key={element.id}>
							<Text style={styles.tableTextBold}>
								{"₹" + parseInt(element.amount)}
							</Text>
							<Text style={styles.timeText}>
								{moment(element.requested_on, "YYYY-MM-DD HH:mm:ss").format(
									"hh:mm a"
								)}
							</Text>
							<Text
								numberOfLines={1}
								ellipsizeMode="tail"
								style={styles.tableText}
							>
								{element.txn_ref_id}
							</Text>
							<Text
								style={
									element.status === "P"
										? styles.tableTextOrange
										: element.status === "S"
										? styles.tableTextGreen
										: styles.tableTextRed
								}
							>
								{status}
							</Text>
						</View>
					);
				})}
			</View>
		);
	};

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Withdraw History"}
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.goBack}
				{...this.props}
			/>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.withdrawHistory}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderBox}
					initialNumToRender={this.state.withdrawHistory.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={
						this.state.withdrawHistory.length === 0 ? styles.container : null
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
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
		alignItems: "center",
	},
	boxHeadText: {
		fontWeight: "bold",
		fontSize: 20,
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 5,
		paddingVertical: 8,
		alignItems: "center",
		borderBottomWidth: 1,
		textAlign: "justify",
		borderBottomColor: Colors.lightGrey,
	},
	tableTextBold: {
		fontSize: 15,
		fontWeight: "bold",
		width: "20%",
		color: "#444",
	},
	timeText: {
		fontSize: 14,
		width: "24%",
		color: "#444",
	},
	tableText: {
		fontSize: 15,
		width: "36%",
		color: "#444",
	},
	tableTextOrange: {
		fontSize: 15,
		textAlign: "right",
		color: Colors.warning,
		fontWeight: "bold",
		width: "20%",
	},
	tableTextGreen: {
		fontSize: 15,
		textAlign: "right",
		color: Colors.success,
		fontWeight: "bold",
		width: "20%",
	},
	tableTextRed: {
		fontSize: 15,
		textAlign: "right",
		color: Colors.danger,
		fontWeight: "bold",
		width: "20%",
	},
});
