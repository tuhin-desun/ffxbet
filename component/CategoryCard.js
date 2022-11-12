import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import Colors from "../config/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	card: {
		width: windowWidth - 16,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 10,
		paddingVertical: 5,
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
		zIndex: 99
	},
	labelContainer: {
		width: "100%",
		padding: 8,
		backgroundColor: Colors.background,
		flexDirection: "row",
		justifyContent: "space-around",
		borderRadius: 10,
		marginTop: 5,
	},
	detailsContainer: {
		width: "100%",
		flexDirection: "row",
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
		justifyContent: "center",
	},
	titleTextStyle: {
		fontSize: 16,
		fontWeight: "bold",
	},
	btnContainer: {
		width: "25%",
		alignItems: "flex-end",
		justifyContent: "center",
	},
	btn: {
		alignItems: "center",
		justifyContent: 'center',
		borderRadius: 100,
		// backgroundColor: Colors.secondary,
		paddingVertical: 9,
		paddingHorizontal: 10,
	},
	btnTextStyle: {
		color: Colors.white,
		fontWeight: "bold",
	},
});

const CategoryCard = (props) => (
	<View style={styles.card}>
		
		<View style={styles.detailsContainer}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: props.imageLink }}
					style={styles.imageStyle}
					resizeMode={"contain"}
				/>
			</View>
			<View style={styles.titleContainer}>
				<Text style={styles.titleTextStyle}>{props.name}</Text>
				<Text style={{fontSize: 11, color: Colors.primary}}>{props.label}</Text>
			</View>
			<View style={styles.btnContainer}>
				<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#f9ac06', '#fdcb36']} style={{borderRadius: 100, justifyContent: 'center'}}>
					<TouchableOpacity onPress={props.btnAction} style={styles.btn}>
						<Ionicons name={'play-outline'} size={30} style={{padding: 0, color: 'black', left: 3}}/>
					</TouchableOpacity>
				</LinearGradient>
			</View>
		</View>
		{/* <View style={styles.labelContainer}>
			<Text>{props.label}</Text>
		</View> */}
	</View>
);

export default CategoryCard;
