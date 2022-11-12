import * as React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import Header from "../component/Header";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import { getBidHistory } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class PlayHistory extends React.Component {
	static contextType = AppContext;

	state = {
		isLoading: true,
		bidHistory: [],
		categoryID:
			typeof this.props.route.params !== "undefined"
				? this.props.route.params.category_id
				: undefined,
		categoryName:
			typeof this.props.route.params !== "undefined"
				? this.props.route.params.category_name
				: undefined,
		bidType:
			typeof this.props.route.params !== "undefined"
				? this.props.route.params.type
				: undefined,
	};

	componentDidMount = () => {
		this.loadBidHistory();
	};

	loadBidHistory = () => {
		let { bidType, categoryID } = this.state;
		let customerCode = this.context.customerData.cust_code;
		getBidHistory(customerCode, bidType, categoryID)
			.then((data) => {
				this.setState({
					bidHistory: data,
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
				this.loadBidHistory();
			}
		);
	};

	gotoBack = () => this.props.navigation.goBack();

	renderBox = ({ item }) => {
		return (
			<View style={styles.box}>
				<View style={styles.boxHead}>
					<Text style={styles.boxHeadText}>
						{moment(item.date, "YYYY-MM-DD").format("Do MMM, YYYY")}
					</Text>
				</View>
				{(item.data || []).map((element) => {
					let statusLabel = Configs.GAME_PLAY_STATUS[element.status].label;
					let bgColor = Configs.GAME_PLAY_STATUS[element.status].bgcolor;
					return (
						<View
							key={element.id}
							style={[styles.tableRow, { backgroundColor: bgColor }]}
						>
							<View style={{ width: "20%" }}>
								<Text style={styles.tableTextBold}>{element.game_title}</Text>
							</View>
							<View style={{ width: "20%" }}>
								<Text style={styles.tableText}>
									{moment(element.bid_on, "YYYY-MM-DD HH:mm:ss").format(
										"hh:mm a"
									)}
								</Text>
							</View>
							<View style={{ width: "20%" }}>
								<Text style={styles.tableText}>{"Bet: " + element.number}</Text>
							</View>
							<View style={{ width: "22%" }}>
								<Text style={styles.tableText}>{"₹" + element.amount}</Text>
							</View>
							<View style={{ width: "18%" }}>
								<Text style={styles.tableTextBoldright}>{statusLabel}</Text>
							</View>
						</View>
					);
				})}
			</View>
		);
	};

	render = () => (
		<View style={styles.container}>
			<Header
				title={this.state.categoryName + " History"}
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.gotoBack}
				{...this.props}
			/>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.bidHistory}
					renderItem={this.renderBox}
					keyExtractor={(item, index) => item.id.toString()}
					initialNumToRender={this.state.bidHistory.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={
						this.state.bidHistory.length === 0 ? styles.container : null
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
		borderColor: Colors.primary,
	},
	boxHead: {
		backgroundColor: Colors.primary,
		paddingVertical: 10,
		alignItems: "center",
	},
	boxHeadText: {
		fontWeight: "bold",
		fontSize: 20,
		color: Colors.white,
	},
	tableRow: {
		flexDirection: "row",
		// justifyContent: "space-between",
		// paddingHorizontal: 8,
		// paddingVertical: 8,
		padding: 8,
		alignItems: "center",
		borderBottomWidth: 1,
		// textAlign: "justify",
		borderBottomColor: Colors.lightGrey,
	},
	tableText: {
		fontSize: 15,
		// textAlign: "center",
		// width: "25%",
		color: Colors.white,
	},

	tableTextBold: {
		fontSize: 15,
		fontWeight: "bold",
		// width: "25%",
		color: Colors.white,
	},

	tableTextBoldright: {
		fontSize: 15,
		textAlign: "right",
		color: Colors.white,
		fontWeight: "bold",
		// width: "25%",
	},
});
