import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import Colors from "../config/colors";
import Header from "../component/Header";
import CategoryCard from "../component/CategoryCard";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import { getGameCategories } from "../services/APIServices";

export default class GameResult extends React.Component {
	state = {
		isLoading: true,
		categories: [],
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

	toggleDrawer = () => this.props.navigation.toggleDrawer();

	gotoViewResult = (item) => {
		this.props.navigation.navigate("View Result", {
			category_id: item.id,
			category_name: item.cat_name,
		});
	};

	renderCategory = ({ item }) => (
		<CategoryCard
			label={item.label}
			imageLink={item.image}
			name={item.cat_name}
			btnText={"View"}
			btnAction={this.gotoViewResult.bind(this, item)}
		/>
	);

	render = () => (
		<View style={styles.container}>
			<Header
				title={"Game Result"}
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
});
