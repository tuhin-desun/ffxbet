import React, {useState} from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
    FlatList,
    Animated 
} from "react-native";
import Colors from "../config/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const Shortcuts = (props) => {

    const [shortcuts, setShortcuts] = useState([
        {id: 1, title1: "ADD", title2: "MONEY", icon: 'cash-outline'},
		{id: 2, title1: 'WITHDRAW', title2: "MONEY", icon: 'arrow-redo-outline'},
		{id: 3, title1: 'ACCOUNT', title2: "UPDATE",icon: 'people-outline'},
		{id: 4, title1: 'MY BID', title2: 'HISTORY', icon: 'bar-chart-outline'},
		{id: 5, title1: 'GAME', title2: 'RESULT', icon: 'calendar-outline'},
    ])

	const gotoAddBalance = () => props.navigation.navigate("Add Balance");

	const gotoWithdrawBalance = () =>
		props.navigation.navigate("Withdraw Balance");

   const onPress = (item) => {
		if(item == 'ADD'){
			gotoAddBalance();
		}else if(item == 'WITHDRAW'){
			gotoWithdrawBalance();
		}else if(item == 'ACCOUNT'){
			props.navigation.navigate("Update Account");
		}else if(item == 'MY BID'){
			props.navigation.navigate('My Bid');
		}else if(item == 'GAME'){
			props.navigation.navigate('Game Result')
		}
	}

    const renderShortcuts = ({item}) => {
		return(
			<TouchableOpacity onPress={() => onPress(item.title1)}>
				<View style={{marginRight: 10, alignItems: 'center', justifyContent: 'center'}}>
					<View style={{borderWidth: 4, borderColor: '#1f8afc', borderRadius: 500, alignItems: 'center', height: 60, width: 60, justifyContent: 'center', backgroundColor: Colors.primary}}>
						<Ionicons name={item.icon} size={30} style={{padding: 0, color: 'white'}}/>
					</View>
					<View style={{alignItems: 'center'}}>
						<Text style={{fontSize: 10, marginTop: 2, alignSelf: 'center', fontWeight: 'bold'}}>{item.title1}</Text>
						<Text style={{fontSize: 10, marginTop: 0, alignSelf: 'center', fontWeight: 'bold'}}>{item.title2}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

		return (
            <View style={{marginLeft: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center', zIndex: 999}}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={shortcuts}
                    renderItem={renderShortcuts}
                    keyExtractor={item => item.id}
                />
        </View>
		);
}

export default Shortcuts;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},


});