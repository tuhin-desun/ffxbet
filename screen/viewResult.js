import React from "react";
import { StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../component/Header";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import { getGameResult } from "../services/APIServices";
import Configs from "../config/Configs";

export default class ViewResult extends React.Component {
	state = {
		isLoading: true,
		gameResults: [],
		categoryID:
			typeof this.props.route.params !== "undefined"
				? this.props.route.params.category_id
				: undefined,
		categoryName:
			typeof this.props.route.params !== "undefined"
				? this.props.route.params.category_name
				: undefined,
		activeTab: 'Single',
	};

	componentDidMount = () => {
		this.loadGameResult();
	};

	loadGameResult = () => {
		let { categoryID, activeTab } = this.state;
		getGameResult(categoryID, activeTab)
			.then((data) => {
				this.setState({
					isLoading: false,
					gameResults: data,
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
				this.loadGameResult();
			}
		);
	};

	gotoBack = () => this.props.navigation.goBack();

	getResultSet1 = (data) => {
		let arr = data.filter((element, index) => index <= 4);
		return arr;
	};

	getResultSet2 = (data) => {
		let arr = data.filter((element, index) => index > 4);
		return arr;
	};

	getResultSet = (data) => {
		let set1 = [];
		let set2 = [];

		data.forEach((v, i) => {
			if (i < 5) {
				set1.push(v);
			} else {
				set2.push(v);
			}
		});

		return { set1, set2 };
	};

	onTabChange = (tabName) => {
		this.setState({
			activeTab: tabName,
			isLoading: true,
		}, () => {
			this.loadGameResult();
		});
	}


	renderItem = ({ item }) => {
		const { activeTab } = this.state;
		let result = this.getResultSet(item.data);
		let resultSet1 = result.set1;
		let resultSet2 = result.set2;

		let list=resultSet1.concat(resultSet2);
		//list=list.concat(resultSet2);
		//list=list.concat(list);
		//list=list.concat(list);


		const getValue=(value)=>{

			if(value==undefined || value==""){
				return "-";
			}
			return value;

		}

		return (
			<View style={styles.box}>
				<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#023f81', '#1f8afc']} >
					<View style={styles.boxHead}>
						<Text style={styles.boxHeadText}>
							{moment(item.date, "YYYY-MM-DD").format("Do MMM, YYYY")}
						</Text>
					</View>
				</LinearGradient>

				{list.length > 0 ? (
					<View style={styles.tableRow}>
						{list.map((element) => (
							<View key={Math.random()} style={styles.tableColumn}>
								<View style={styles.resultBox}>
									<View style={styles.titleBox}>
										<Text style={styles.gameTitle}>{element.game_name}</Text>
									</View>
									{activeTab === Configs.BID_TYPE_SINGLE ? (
										<LinearGradient
											colors={["white", "transparent"]}
											style={styles.gradientBox}
										>
											<Text style={styles.tableTextBold}>{element.Single}</Text>
											<Text style={styles.tableTextBold}>{element.Patti}</Text>
										</LinearGradient>
									) : (
										<LinearGradient
											colors={["white", "transparent"]}
											style={styles.gradientBox}
										>
											{/* <Text style={styles.tableTextBold}>{element.Jodi ? element.jodi : "-"}</Text> */}
											<Text style={styles.tableTextBold}>{getValue(element.Jodi)}</Text>
										</LinearGradient>
									)}
								</View>
							</View>
						))}
					</View>
				) : null}

				{/* {resultSet1.length > 0 ? (
					<View style={styles.tableRow}>
						{resultSet1.map((element) => (
							<View key={element.game_id.toString()} style={styles.tableColumn}>
								<View style={styles.resultBox}>
									<View style={styles.titleBox}>
										<Text style={styles.gameTitle}>{element.game_name}</Text>
									</View>
									{activeTab === Configs.BID_TYPE_SINGLE ? (
										<LinearGradient
											colors={["white", "transparent"]}
											style={styles.gradientBox}
										>
											<Text style={styles.tableTextBold}>{element.Single}</Text>
											<Text style={styles.tableTextBold}>{element.Patti}</Text>
										</LinearGradient>
									) : (
										<LinearGradient
											colors={["white", "transparent"]}
											style={styles.gradientBox}
										>
											<Text style={styles.tableTextBold}>{element.Jodi ? element.Jodi : "-"}</Text>
										</LinearGradient>
									)}

								</View>
							</View>
						))}
					</View>
				) : null}

				{resultSet2.length > 0 ? (
					<View style={styles.tableRow}>
						{resultSet2.map((element) => (
							<View key={element.game_id.toString()} style={styles.tableColumn}>
								<View style={styles.resultBox}>
									<View style={styles.titleBox}>
										<Text style={styles.gameTitle}>{element.game_name}</Text>
									</View>
									{activeTab === Configs.BID_TYPE_SINGLE ? (
										<LinearGradient
											colors={["white", "transparent"]}
											style={styles.gradientBox}
										>
											<Text style={styles.tableTextBold}>{element.Single}</Text>
											<Text style={styles.tableTextBold}>{element.Patti}</Text>
										</LinearGradient>
									) : (
										<LinearGradient
											colors={["white", "transparent"]}
											style={styles.gradientBox}
										>
											<Text style={styles.tableTextBold}>{element.Jodi ? element.jodi : "-"}</Text>
										</LinearGradient>
									)}
								</View>
							</View>
						))}
					</View>
				) : null} */}
			</View>
		);
	};

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Result of " + this.state.categoryName}
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.gotoBack}
				{...this.props}
			/>

			{this.state.isLoading ? (
				<Loader />
			) : (
				<View>
					<View style={styles.tabBar}>
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
									Single/Patti
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.tab}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={this.onTabChange.bind(this, Configs.BID_TYPE_JODI)}
								style={
									this.state.activeTab === Configs.BID_TYPE_JODI
										? styles.activeTabStyle
										: styles.tabStyle
								}
							>
								<Text
									style={
										this.state.activeTab === Configs.BID_TYPE_JODI
											? styles.activeTabTextStyle
											: styles.tabTextStyle
									}
								>
									Jodi
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View>
						<FlatList
							ListEmptyComponent={() => <ListEmpty />}
							data={this.state.gameResults}
							renderItem={this.renderItem}
							keyExtractor={(item) => item.id.toString()}
							showsVerticalScrollIndicator={false}
							initialNumToRender={this.state.gameResults.length}
							refreshing={this.state.isLoading}
							onRefresh={this.handelRefresh}
							height={windowHeight-102}
							contentContainerStyle={
								this.state.gameResults.length === 0 ? styles.container : null
							}
						/>
					</View>
				</View>

			)}
		</View>
	);
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGrey,
	},
	box: {
		backgroundColor: "#d0e5ff",
		marginHorizontal: 5,
		marginVertical: 5,
		borderColor: Colors.secondary,
	},
	boxHead: {
		paddingVertical: 6,
		alignItems: "center",
	},
	boxHeadText: {
		fontWeight: "400",
		fontSize: 20,
		color: 'white'
	},
	tableRow: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		// justifyContent: "space-around",
	},
	tableColumn: {
		width: Math.floor((windowWidth - 10) / 6),
		height: 110,
		alignItems: "center",
		justifyContent: "center",
	},
	resultBox: {
		height: 90,
		width: 45,
		elevation: 7,
		borderRadius: 5,
	},
	titleBox: {
		width: "100%",
		height: 20,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
	},
	gameTitle: {
		fontSize: 12,
		color: "white",
	},
	gradientBox: {
		backgroundColor: Colors.lightGrey,
		alignItems: "center",
		height: 70,
		justifyContent: "space-around",
		// width: "11%",
		width: "100%",
		// marginVertical: 10,
		// marginHorizontal: 5,
		borderWidth: 0.5,
		borderColor: Colors.darkgrey,
		// borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		// elevation: 7,
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
	},
	tableTextBold: {
		fontWeight: "bold",
		fontSize: 18,
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
});
