import * as React from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../component/Header";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import { getTransactions } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class Transactions extends React.Component {
	static contextType = AppContext;

	state = {
		page: 1,
		transactions: [],
		isLoading: true,
		isLoadMore: false,
	};

	componentDidMount = () => {
		this.loadTransactions();
	};

	loadTransactions = () => {
		let customerCode = this.context.customerData.cust_code;
		let { page, transactions } = this.state;

		getTransactions(customerCode, page)
			.then((response) => {
				let requested_records = parseInt(response.requested_records);
				let records_in_response = parseInt(response.records_in_response);

				this.setState({
					isLoading: false,
					transactions:
						page === 1 ? response.data : [...transactions, ...response.data],
					page: this.state.page + 1,
					isLoadMore: records_in_response >= requested_records,
				});
			})
			.catch((error) => console.log(error));
	};

	handelRefresh = () => {
		this.setState(
			{
				page: 1,
				transactions: [],
				isLoading: true,
				isLoadMore: false,
			},
			() => {
				this.loadTransactions();
			}
		);
	};

	gotoBack = () => this.props.navigation.goBack();

	renderBox = ({ item }) => {
		let amountTextColor = item.type === "CR" ? Colors.success : Colors.danger;
		let amount = parseInt(item.amount);
		amount = item.type === "CR" ? "+ ₹" + amount : "- ₹" + amount;

		return (
			<View style={styles.itemContainer}>
				<View style={styles.iconContainer}>
					{item.type === "CR" ? (
						<Ionicons name="wallet" size={28} color={Colors.success} />
					) : (
						<Entypo name="export" size={28} color={Colors.danger} />
					)}
				</View>
				<View style={styles.purposeConatiner}>
					<Text style={styles.purposeText}>{item.purpose}</Text>
					<Text style={styles.dateTimeText}>
						{moment(item.created_on, "YYYY-MM-DD HH:mm:ss").format(
							"DD MMM YYYY, hh:mm A"
						)}
					</Text>
				</View>
				<View style={styles.amountContainer}>
					<Text style={{ color: amountTextColor }}>{amount}</Text>
				</View>
			</View>
		);
	};

	listFooterComponent = () => {
		let { isLoadMore } = this.state;
		return (
			<View
				style={[
					styles.listFooterContainer,
					isLoadMore ? { height: 70, paddingTop: 6 } : null,
				]}
			>
				{isLoadMore ? (
					<>
						<Text style={styles.loadingText}>Hang on, loading content...</Text>
						<ActivityIndicator size="small" color={Colors.primary} />
					</>
				) : null}
			</View>
		);
	};

	listEmptyComponent = () => <ListEmpty />;

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Transactions"}
				rightIconName={"wallet-outline"}
				leftIconName={"arrow-back"}
				leftButtonFunc={this.gotoBack}
				{...this.props}
			/>
			{this.state.transactions.length > 0 ? (
				<View style={styles.heading}>
					<Text style={styles.headingTitle}>Your Transactions</Text>
				</View>
			) : null}

			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={this.listEmptyComponent.bind(this)}
					data={this.state.transactions}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderBox}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={this.listFooterComponent.bind(this)}
					onEndReachedThreshold={0}
					onEndReached={
						this.state.isLoadMore ? this.loadTransactions : undefined
					}
					contentContainerStyle={
						this.state.transactions.length === 0 ? styles.container : null
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGrey,
	},
	heading: {
		width: "100%",
		backgroundColor: Colors.lightGrey,
		paddingVertical: 20,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	headingTitle: {
		color: "#444",
		fontSize: 20,
		letterSpacing: 0.5,
	},
	itemContainer: {
		width: "100%",
		flexDirection: "row",
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	iconContainer: {
		width: "15%",
		alignItems: "center",
		justifyContent: "center",
	},
	purposeConatiner: {
		width: "60%",
	},
	purposeText: {
		color: "#000",
		fontSize: 14,
		marginBottom: 5,
	},
	dateTimeText: {
		color: "#444",
		opacity: 0.9,
		fontSize: 12,
	},
	amountContainer: {
		width: "25%",
		justifyContent: "center",
		alignItems: "flex-end",
	},
	listFooterContainer: {
		width: "100%",
		height: 5,
		backgroundColor: Colors.lightGrey,
	},
	loadingText: {
		textAlign: "center",
		lineHeight: 20,
		fontSize: 14,
		color: "#444",
		opacity: 0.8,
	},
});
