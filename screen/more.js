import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Share,
	ScrollView,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import Colors from "../config/colors";
import Header from "../component/Header";
import { shareApp } from "../utils/Util";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import AppContext from "../context/AppContext";

const windowWidth = Dimensions.get("window").width;

const GridBox = (props) => {
	return (
		<TouchableOpacity
			activeOpacity={0.6}
			onPress={props.onPress}
			style={styles.GridBoxStyle}
		>
			<View
				style={{
					width: "12%",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{props.iconType === "MaterialCommunityIcons" ? (
					<MaterialCommunityIcons
						name={props.iconName}
						size={28}
						color={Colors.primary}
					/>
				) : props.iconType === "Entypo" ? (
					<Entypo name={props.iconName} size={28} color={Colors.primary} />
				) : (
					<Ionicons name={props.iconName} size={28} color={Colors.primary} />
				)}
			</View>
			<View style={{ width: "78%" }}>
				<Text
					style={{ fontSize: 16, fontWeight: "bold", color: Colors.primary }}
				>
					{props.title}
				</Text>
			</View>
			<View
				style={{ width: "10%", alignItems: "center", justifyContent: "center" }}
			>
				<Ionicons name="chevron-forward" size={22} color={Colors.primary} />
			</View>
		</TouchableOpacity>
	);
};

export default class More extends React.Component {
	static contextType = AppContext;

	toggleDrawer = () => this.props.navigation.toggleDrawer();

	onShare = async () => {
		let settings = this.context.appSettings;
		let contentObj = { message: settings.share_msg };
		shareApp(contentObj);
	};

	render = () => (
		<View style={styles.container}>
			<Header
				rightIconName={"wallet-outline"}
				title={"More"}
				leftIconName={"menu"}
				leftButtonFunc={this.toggleDrawer}
				{...this.props}
			/>
			<ScrollView>
				<GridBox
					title={"Add Money"}
					iconType={"Ionicons"}
					iconName={"wallet"}
					onPress={() => this.props.navigation.navigate("Add Balance")}
				/>
				<GridBox
					title={"Withdraw Winning"}
					iconType={"MaterialCommunityIcons"}
					iconName={"application-export"}
					onPress={() => this.props.navigation.navigate("Withdraw Balance")}
				/>
				<GridBox
					title={"Update Account Details"}
					iconType={"MaterialCommunityIcons"}
					iconName={"account-edit"}
					onPress={() => this.props.navigation.navigate("Update Account")}
				/>
				<GridBox
					title={"Game Rules & Regulations"}
					iconType={"Ionicons"}
					iconName={"shield-checkmark"}
					onPress={() => this.props.navigation.navigate("Game Rules")}
				/>
				<GridBox
					title={"Deposite History"}
					iconType={"Ionicons"}
					iconName={"today"}
					onPress={() => this.props.navigation.navigate("Deposit History")}
				/>
				<GridBox
					title={"Withdraw History"}
					iconType={"Ionicons"}
					iconName={"calendar"}
					onPress={() => this.props.navigation.navigate("Withdraw History")}
				/>
				<GridBox
					title={"Transaction History"}
					iconType={"Entypo"}
					iconName={"back-in-time"}
					onPress={() => this.props.navigation.navigate("Transaction History")}
				/>
				<GridBox
					title={"Share App"}
					iconType={"Ionicons"}
					iconName={"share-social"}
					onPress={this.onShare}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	GridBoxStyle: {
		width: windowWidth,
		backgroundColor: Colors.white,
		borderBottomColor: Colors.background,
		borderBottomWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 15,
		alignItems: "center",
	},
});
