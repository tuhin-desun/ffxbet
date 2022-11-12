import React from "react";
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../component/Header";
import Loader from "../component/Loader";
import { getGames, getTimeDate } from "../services/APIServices";
import { checkGameAvailabilityy } from "../utils/Util";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';

export default class Game extends React.Component {
	state = {
		games: [],
		isLoading: true,
		categoryID: this.props.route.params.category_id,
		categoryName: this.props.route.params.category_name,
		today: moment().format("YYYY-MMM-DD"),
		currentDateTime: moment().format("YYYY-MMM-DD HH:mm:ss")
	};

	componentDidMount = () => {
		this.loadGames();
	};

	loadGames = () => {
		Promise.all([getGames(this.state.categoryID), getTimeDate()])
			.then((data) => {
				console.log(data)
				this.setState({
					isLoading: false,
					games: data[0],
					today: data[1].date,
					currentDateTime: `${data[1].date} ${data[1].time}`
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
				this.loadGames();
			}
		);
	};

	gotoGamePlay = (item) => {
		this.props.navigation.navigate("Play", {
			game_id: item.id,
			game_code: item.gcode,
			game_title: item.name,
			start_time: item.start_time,
			end_time: item.end_time,
			minum_coin: item.minum_coin,
		});
	};

	gotoGameType = (item, next_game_code, is_last) => {
		const { categoryID, categoryName} = this.state;
		this.props.navigation.navigate("GameType", {
			category_id: categoryID,
			category_name: categoryName,
			game_id: item.id,
			game_code: item.gcode,
			game_title: item.name,
			start_time: item.start_time,
			end_time: item.end_time,
			minum_coin: item.minum_coin,
			next_game_code: next_game_code,
			is_last: is_last
		});
	};

	renderItem = ({ item , index}) => {
		let key = index+1;
		let is_last = false;
		if(this.state.games.length == key){
			key = 0;
			is_last = true;
		}
		let next_game_code = this.state.games[key].gcode;
		
		let isGameAvailable = checkGameAvailabilityy(item.start_time, item.end_time, this.state.today, this.state.currentDateTime);
		// let isGameAvailable = true;
		return (
			<View style={styles.card}>
				<View style={styles.detailsContainer}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: item.image }}
							style={styles.imageStyle}
							resizeMode={"contain"}
						/>
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.titleTextStyle}>{item.name}</Text>
					</View>
					<View style={styles.btnContainer}>
						<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={isGameAvailable? ['#00b100', '#08ff00'] : ['#ae0000', '#FE0000']} style={{borderRadius: 100, justifyContent: 'center'}}>
							<TouchableOpacity
								activeOpacity={isGameAvailable ? 0.2 : 1}
								onPress={
									isGameAvailable ? this.gotoGameType.bind(this, item, next_game_code, is_last) : null
								}
								// style={[
								// 	styles.btn,
								// 	isGameAvailable ? {backgroundColor:'#029f21'} : { backgroundColor: "#FE0000" },
								// ]}
							>
								
									<View style={styles.button}>
										<Ionicons name={'play-outline'} size={30} style={{padding: 0, color: 'white', left: 3}}/>
									</View>
								
							</TouchableOpacity>
						</LinearGradient>
						{/* <TouchableOpacity
							activeOpacity={isGameAvailable ? 0.2 : 1}
							onPress={
								isGameAvailable ? this.gotoGameType.bind(this, item, next_game_code, is_last) : null
							}
							style={[
								styles.btn,
								isGameAvailable ? {backgroundColor:'#029f21'} : { backgroundColor: "#FE0000" },
							]}
						>
							<Text style={styles.btnTextStyle}>{"PLAY"}</Text>
						</TouchableOpacity> */}
					</View>
				</View>
				<View style={styles.labelContainer}>
					{isGameAvailable ? (
						<>
							<Text style={{fontSize: 13, color: Colors.primary}}>
								Open Time -{" "}
								{moment(item.start_time, "HH:mm:ss").format("hh:mm a")}
							</Text>
							<Text style={{fontSize: 13, color: Colors.primary}}>
								Close Time -{" "}
								{moment(item.end_time, "HH:mm:ss").format("hh:mm a")}
							</Text>
						</>
					) : (
						<Text style={{ color: "red", fontSize: 13 }}>Game is closed for today</Text>
					)}
				</View>
			</View>
		);
	};

	getListEmptyComponent = () => (
		<View style={styles.lisEmptyContainer}>
			<Text style={styles.listEmptyText}>Game is closed for today</Text>
		</View>
	);

	gotoBack = () => this.props.navigation.goBack();

	render = () => (
		<View style={styles.container}>
			<Header
				leftIconName={"arrow-back"}
				rightIconName={"wallet-outline"}
				title={this.state.categoryName}
				leftButtonFunc={this.gotoBack}
				{...this.props}
			/>

			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => this.getListEmptyComponent()}
					data={this.state.games}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.renderItem}
					initialNumToRender={this.state.games.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.games.length === 0 ? styles.container : null
					}
				/>
			)}
		</View>
	);
}

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	lisEmptyContainer: {
		flex: 1,
		backgroundColor: Colors.background,
		alignItems: "center",
		justifyContent: "center",
	},
	listEmptyText: {
		fontSize: 16,
		color: Colors.danger,
	},
	card: {
		width: windowWidth - 16,
		backgroundColor: Colors.white,
		borderRadius: 10,
		padding: 10,
		paddingVertical: 0,
		marginHorizontal: 8,
		marginVertical: 5,
		shadowColor: Colors.dark,
		shadowOffset: {
			width: 6,
			height: 6,
		},
		shadowOpacity: 0.58,
		shadowRadius: 2.0,
		elevation: 5,
	},
	detailsContainer: {
		width: "100%",
		flexDirection: "row",
		marginBottom: 5,
	},
	imageContainer: {
		width: "20%",
		alignItems: "flex-start",
		justifyContent: "center",
	},
	imageStyle: {
		height: 60,
		width: 60,
		alignItems: "center",
	},
	titleContainer: {
		width: "55%",
		alignItems: "flex-start",
		justifyContent: "center",
	},
	titleTextStyle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	btnContainer: {
		width: "25%",
		alignItems: "flex-end",
		justifyContent: "center",
	},
	btn: {
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: Colors.secondary,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	btnTextStyle: {
		color: Colors.white,
		fontWeight: "bold",
	},
	labelContainer: {
		padding: 8,
		paddingTop: 2,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-around",
		borderRadius: 10,
	},

	button: {
		alignItems: "center",
		justifyContent: 'center',
		borderRadius: 100,
		// backgroundColor: Colors.secondary,
		paddingVertical: 9,
		paddingHorizontal: 10,
	},
});
