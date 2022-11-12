import React from "react";
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Image,
	FlatList,
	TouchableOpacity,
	ScrollView
} from "react-native";
import Carousel, { PaginationLight } from "react-native-x2-carousel";
import TextTicker from "react-native-text-ticker";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Colors from "../config/colors";
import Config from "../config/Configs";
import Header from "../component/Header";
import CategoryCard from "../component/CategoryCard";
import {
	getNews,
	getCarouselData,
	getGameCategories,
	getAccountInfo,
	getAppSettings
} from "../services/APIServices";
import AppContext from "../context/AppContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Shortcuts from '../component/Shortcuts'

const NEWS_CONTAINER_HEIGHT = 50;
const HEADING_CONTAINER_HEIGHT = 50;
const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 2) / 5);

export default class Dashboard extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.carousel = React.createRef();
		this.state = {
			isNewsLoading: true,
			isCarouselLoading: true,
			isCategoryLoading: true,
			newsArr: [],
			carouselArr: [],
			categoryArr: [],
			activeSlide: 0,
			settings: [],
		};
	}

	componentDidMount = () => {
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			this.checkAccount(this.context.customerData.cust_code);
			Promise.all([getNews(), getCarouselData(), getGameCategories(), getAppSettings()])
				.then((response) => {

					//console.log(response);
					let newsArr = [];
					(response[0] || []).forEach((v, i) => {
						newsArr.push(v.news);
					});

					this.setState({
						newsArr: newsArr,
						carouselArr: response[1],
						categoryArr: response[2],
						isNewsLoading: false,
						isCarouselLoading: false,
						isCategoryLoading: false,
						settings: response[3],
					});
				})
				.catch((error) => console.log(error));
		});

	};

	componentWillUnmount = () => {
		this._unsubscribe();
	}

	checkAccount = (customerCode) => {
		getAccountInfo(customerCode)
			.then((response) => {
				if (response.is_deleted == '1') {
					this.props.navigation.navigate("Logout")
				}
			})
			.catch((err) => { console.log(err) })
	}

	renderItem = (item) => {
		return (
			<View key={item.id.toString()} style={styles.slide}>
				<Image resizeMode="cover" style={styles.sliderImage} source={{ uri: item.attachment }} />
			</View>
		);
	};

	toggleDrawer = () => this.props.navigation.toggleDrawer();

	gotoAddBalance = () => this.props.navigation.navigate("Add Balance");

	gotoWithdrawBalance = () =>
		this.props.navigation.navigate("Withdraw Balance");

	gotoGameList = (categoryID, categoryName) => {
		this.props.navigation.navigate("Game", {
			category_id: categoryID,
			category_name: categoryName,
		});
	};



	renderCategory = ({ item }) => (
		<CategoryCard
			label={item.label}
			imageLink={item.image}
			name={item.cat_name}
			btnText={"PLAY"}
			btnAction={this.gotoGameList.bind(this, item.id, item.cat_name)}
		/>
	);



	render = () => {
		const game_off_image = Config.GAME_SETTINGS_IMAGE_URL + this.state.settings.game_off_image;
		console.log(game_off_image);
		return (
			<View style={styles.container}>
				<Header
					title={"Dashboard"}
					leftIconName={"menu"}
					rightIconName={"wallet-outline"}
					leftButtonFunc={this.toggleDrawer}
					{...this.props}
				/>

				<ScrollView
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[3]}
				>
					{/* <View style={styles.headingContainer}>
					<View style={styles.btnContainer}>
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.addBtn, { backgroundColor: '#c5009d' }]}
								onPress={this.gotoAddBalance}
							>
								<Text style={styles.btnText}>ADD</Text>
								<Text style={styles.btnText}>MONEY</Text>
							</TouchableOpacity>
						</View>

						<View style={[styles.btnContainer, { width: '50%' }]}>
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.addBtn, { width: '100%', height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: "#029f21" }]}
								onPress={() => this.props.navigation.navigate("Update Account")}
							>
								<Text style={styles.btnText}>ACCOUNT UPDATE</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.btnContainer}>
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.withdrawBtn, { backgroundColor: '#602AB6' }]}
								onPress={this.gotoWithdrawBalance}
							>
								<Text style={styles.btnText}>WITHDRAW</Text>
								<Text style={styles.btnText}>MONEY</Text>
							</TouchableOpacity>
						</View>

						

					</View> */}

					{this.state.isNewsLoading ? (
						<SkeletonPlaceholder
							backgroundColor={Colors.skeletonBackground}
							highlightColor={Colors.white}
							speed={1000}
						>
							<View style={styles.newsSkeleton} />
						</SkeletonPlaceholder>
					) : (
						<></>
					)}

					<View style={styles.carouselConatainer}>
						{this.state.isCarouselLoading ? (
							<SkeletonPlaceholder
								backgroundColor={Colors.skeletonBackground}
								highlightColor={Colors.white}
								speed={1000}
							>
								<View style={styles.carouselSkeleton} />
							</SkeletonPlaceholder>
						) : (
							<Carousel
								loop={true}
								autoplay={true}
								autoplayInterval={3000}
								pagination={PaginationLight}
								renderItem={this.renderItem}
								data={this.state.carouselArr}
							/>
						)}
					</View>
					<View style={styles.newsContainer}>
								<TextTicker
									style={{ fontSize: 13, fontWeight: "bold", color: 'white' }}
									scrollSpeed={100}
									repeatSpacer={0}
									marqueeDelay={0}
								>
									{this.state.newsArr.join(" | ") + " | "}
								</TextTicker>
							</View>
							
							<Shortcuts navigation={this.props.navigation}/>
					{this.state.isCategoryLoading ? (

						<SkeletonPlaceholder
							backgroundColor={Colors.skeletonBackground}
							highlightColor={Colors.white}
							speed={1000}
						>
							<View style={styles.listSkeleton} />
						</SkeletonPlaceholder>
					) : (
						<>
							
							{this.state.settings.game_off == '0' ? (
								// <FlatList
								// 	data={this.state.categoryArr}
								// 	renderItem={this.renderCategory}
								// 	keyExtractor={(item) => item.id.toString()}
								// 	showsVerticalScrollIndicator={false}
								// 	initialNumToRender={this.state.categoryArr.length}
								// />
								this.state.categoryArr?.map(item => {
									return (
										<View style={{zIndex: 99, backgroundColor: Colors.lightGrey}}>
										<CategoryCard
											key={item.id}
											label={item.label}
											imageLink={item.image}
											name={item.cat_name}
											btnText={"PLAY"}
											btnAction={this.gotoGameList.bind(this, item.id, item.cat_name)}
										/>
										</View>
									)
								})

							) : (

								<ScrollView>
									<View style={{ margin: 5 }}>
										<View style={{ flex: 1, alignItems: 'center', marginBottom: 10 }}>
											<Text style={{ fontSize: 18, color: Colors.red, fontWeight: 'bold' }}>{this.state.settings.game_off_reason}</Text>
										</View>
										<View style={{ flex: 1 }}>
											<Image style={{ height: 350, width: "100%" }} source={{ uri: game_off_image }} />
										</View>
									</View>
								</ScrollView>
							)}
						</>
					)}
				</ScrollView>
			</View>
		)
	};
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	newsSkeleton: {
		margin: 5,
		width: SLIDER_WIDTH - 10,
		height: NEWS_CONTAINER_HEIGHT,
		borderRadius: 3,
	},
	newsContainer: {
		// alignItems: "center",
		justifyContent: "center",
		backgroundColor: 'red',
		margin: 0,
		marginHorizontal: 0,
		height: 30,
		alignSelf: "center",
		paddingHorizontal: 5,
		borderRadius: 3,
		width: '95%'
	},
	carouselConatainer: {
		marginVertical: 5,
	},
	carouselSkeleton: {
		marginHorizontal: 5,
		height: ITEM_HEIGHT,
		width: ITEM_WIDTH - 10,
		borderRadius: 3,
	},
	slide: {
		height: ITEM_HEIGHT,
		width: ITEM_WIDTH - 10,
		marginHorizontal: 5,
		borderRadius: 3,
	},
	sliderImage: {
		height: ITEM_HEIGHT,
		width: ITEM_WIDTH - 10,
		borderRadius: 3,
	},
	headingContainer: {
		height: HEADING_CONTAINER_HEIGHT,
		width: "100%",
		backgroundColor: "white",
		flexDirection: "row",
	},
	titleContainer: {
		width: "50%",
		// alignItems: "center",
		// justifyContent: "center",

		backgroundColor: Colors.warning,
		//width: 70,
		paddingVertical: 5,
		borderRadius: 4,
	},
	headingText: {
		color: Colors.secondary,
		fontWeight: "bold",
		fontSize: 16,
	},
	listSkeleton: {
		margin: 5,
		width: SLIDER_WIDTH - 10,
		height: NEWS_CONTAINER_HEIGHT + ITEM_HEIGHT + HEADING_CONTAINER_HEIGHT,
		borderRadius: 3,
	},
	btnContainer: {
		width: "25%",
		alignItems: "center",
		justifyContent: "center",
	},
	addBtn: {
		backgroundColor: Colors.warning,
		width: 70,
		paddingVertical: 5,
		borderRadius: 4,
	},
	withdrawBtn: {
		backgroundColor: Colors.danger,
		width: 70,
		paddingVertical: 5,
		borderRadius: 4,
	},
	btnText: {
		color: Colors.white,
		fontSize: 12,
		lineHeight: 12,
		textAlign: "center",
	},
});
