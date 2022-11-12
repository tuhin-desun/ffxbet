import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import Colors from "../config/colors";
import Header from "../component/Header";
import AppContext from "../context/AppContext";

export default class GameRules extends React.Component {
	static contextType = AppContext;

	gotoBack = () => this.props.navigation.goBack();

	render = () => (
		<View style={styles.container}>
			<Header
				rightIconName={"wallet-outline"}
				title={"Game Rules & Regulations"}
				leftIconName={"arrow-back"}
				leftButtonFunc={this.gotoBack}
				{...this.props}
			/>

			<WebView
				source={{ uri: this.context.appSettings.rules_page_url }}
				containerStyle={styles.rulesContainer}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	rulesContainer: {
		flex: 1,
	},
});
