import React from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Modal,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Configs from "../config/Configs";
import Colors from "../config/colors";
import Header from "../component/Header";
import CategoryCard from "../component/CategoryCard";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import { getGameCategories } from "../services/APIServices";

export default class MyBid extends React.Component {
	state = {
		isLoading: true,
		categories: [],
		selectedCategoryID: undefined,
		selectedCategoryName: undefined,
		modalVisible: false,
	};

	componentDidMount = () => {
		this.loadCategories();
	};

	loadCategories = () => {
		getGameCategories()
			.then((data) => {
				this.setState({
					isLoading: false,
					categories: data,
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
				this.loadCategories();
			}
		);
	};

	openModal = (item) => {
		this.setState({
			modalVisible: true,
			selectedCategoryID: item.id,
			selectedCategoryName: item.cat_name,
		});
	};

	closeModal = () =>
		this.setState({
			selectedCategoryID: undefined,
			selectedCategoryName: undefined,
			modalVisible: false,
		});

	gotoPlayHistory = (type) => {
		this.setState(
			{
				modalVisible: false,
			},
			() => {
				this.props.navigation.navigate("PlayHistory", {
					category_id: this.state.selectedCategoryID,
					category_name: this.state.selectedCategoryName,
					type: type,
				});
			}
		);
	};

	renderCategory = ({ item }) => (
		<CategoryCard
			label={item.label}
			imageLink={item.image}
			name={item.cat_name}
			btnText={"View"}
			btnAction={this.openModal.bind(this, item)}
		/>
	);

	toggleDrawer = () => this.props.navigation.toggleDrawer();

	render = () => (
		<View style={styles.container}>
			<Header
				title={"My BID"}
				leftIconName={"menu"}
				rightIconName={"wallet-outline"}
				leftButtonFunc={this.toggleDrawer}
				{...this.props}
			/>

			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					ListEmptyComponent={() => <ListEmpty />}
					data={this.state.categories}
					renderItem={this.renderCategory}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					initialNumToRender={this.state.categories.length}
					refreshing={this.state.isLoading}
					onRefresh={this.handelRefresh}
					contentContainerStyle={
						this.state.categories.length === 0 ? styles.container : null
					}
				/>
			)}

			<Modal
				animationType="fade"
				transparent={true}
				statusBarTranslucent={true}
				visible={this.state.modalVisible}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalBody}>
						<Text style={styles.titleText}>
							{this.state.selectedCategoryName}
						</Text>
						<View style={styles.btnContainer}>
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.btn,{backgroundColor:'#FE5722'}]}
								onPress={this.gotoPlayHistory.bind(
									this,
									Configs.BID_TYPE_SINGLE
								)}
							>
								<Text style={styles.btnText}>Single</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={1}
								style={[styles.btn,{backgroundColor:'#8BC24A'}]}
								onPress={this.gotoPlayHistory.bind(
									this,
									Configs.BID_TYPE_PATTI
								)}
							>
								<Text style={styles.btnText}>Patti</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={1}
								style={[styles.btn,{backgroundColor:'#602AB6'}]}
								onPress={this.gotoPlayHistory.bind(
									this,
									Configs.BID_TYPE_JODI
								)}
							>
								<Text style={styles.btnText}>Jodi</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={1}
								style={[styles.btn,{backgroundColor:'#9C28B1'}]}
								onPress={this.gotoPlayHistory.bind(
									this,
									Configs.BID_TYPE_CP
								)}
							>
								<Text style={styles.btnText}>CP</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={this.closeModal}
						>
							<Ionicons name="close-outline" style={styles.closeButtonText} />
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	modalBody: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFF",
		width: windowWidth - 16,
		minHeight: Math.floor(windowHeight / 4),
		padding: 15,
		borderRadius: 5,
		elevation: 10,
	},
	titleText: {
		color: "#444",
		fontSize: 20,
		marginBottom: 10,
		fontWeight: "bold",
		letterSpacing: 0.5,
	},
	btnContainer: {
		flexDirection: "column",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	btn: {
		width: '100%',
		backgroundColor: Colors.primary,
		borderRadius: 5,
		paddingVertical: 30,
		margin: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	btnText: {
		color: Colors.white,
		fontSize: 18,
	},
	closeButton: {
		position: "absolute",
		zIndex: 11,
		top: 5,
		right: 5,
		backgroundColor: "#ddd",
		width: 25,
		height: 25,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
		elevation: 0,
	},
	closeButtonText: {
		color: "#444",
		fontSize: 22,
	},
});
