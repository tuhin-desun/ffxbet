import { Share } from "react-native";
import moment from "moment";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import clockSync from 'react-native-clock-sync'

export const readCustomerData = async () => {
	try {
		let rawData = await AsyncStorage.getItem("@kolkat_fatafat_user_data");
		return rawData !== null ? JSON.parse(rawData) : null;
	} catch (e) {
		throw new Error("failed data retrieve from device");
	}
};

export const writeCustomerData = async (value) => {
	try {
		await AsyncStorage.setItem(
			"@kolkat_fatafat_user_data",
			JSON.stringify(value)
		);
	} catch (e) {
		throw new Error("failed data save to device");
	}
};

export const removeCustomerData = async () => {
	try {
		await AsyncStorage.removeItem("@kolkat_fatafat_user_data");
	} catch (e) {
		throw new Error("failed to remove data from device");
	}
};

export const checkGameAvailability = (startTime, endTime) => {
	let today = moment().format("YYYY-MMM-DD");
	let currentDateTime = moment().format("YYYY-MMM-DD HH:mm:ss");

	let start = today + " " + startTime;
	let end = today + " " + endTime;

	return moment(currentDateTime, "YYYY-MMM-DD HH:mm:ss").isBetween(
		moment(start, "YYYY-MMM-DD HH:mm:ss"),
		moment(end, "YYYY-MMM-DD HH:mm:ss")
	);
};

export const checkGameAvailabilityy = (startTime, endTime,todayDate, todayDateTime) => {
	let today = todayDate;
	let currentDateTime = todayDateTime;

	let start = today + " " + startTime;
	let end =  today + " " + endTime;

	return moment(currentDateTime, "YYYY-MMM-DD HH:mm:ss").isBetween(
		moment(start, "YYYY-MMM-DD HH:mm:ss"),
		moment(end, "YYYY-MMM-DD HH:mm:ss")
	);
};

export const getDeviceToken = async () => {
	let token = null;

	if (Constants.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus === "granted") {
			token = await Notifications.getExpoPushTokenAsync({ experienceId: '@desun/ffwinner' });
		} else {
			console.log("Failed to get push token for push notification!");
		}
	} else {
		console.log("Must use physical device for Push Notifications");
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}
	
	return token;
};

export const shareApp = async (contentObj) => {
	try {
		await Share.share(contentObj);
	} catch (error) {
		console.log(error);
	}
};

const countRepeatingElement = (arr) => {
	const counts = {};
	arr.forEach((x) => {
	  counts[x] = (counts[x] || 0) + 1;
	});
	return counts;
}


const shiftZeroValue = (arr) => {
	for(let i=0;i<arr.length;i++){
		console.log("Sh9ot zero",arr)
		if(arr[i] == 0){
			arr.push(arr.shift());
		}
	}
	return arr;
}

export const generateCombination = (combination, combinationLength) => {
	let sortedDigit = Array.from(combination.toString()).map(Number).sort();
	// console.log("sortedDigit",sortedDigit)
	if(sortedDigit.includes(0)){
		const repeats = countRepeatingElement(sortedDigit);
		if(repeats[0] == 1){
			let newsortedDigit = sortedDigit.push(sortedDigit.shift());
		}
		if(repeats[0] > 1){
			sortedDigit  = shiftZeroValue(sortedDigit);
		}	
	}
	// sortedDigit = [1,1,1,0,0];
	const combinationResult = combinations(sortedDigit, combinationLength);
	const final = combinationResult.map( element => element.join('') );
	let unique = [...new Set(final)];
	console.log(unique.includes(0))
	return unique;
}

const combinations = ( collection, combinationLength ) => {
	let head, tail, result = [];
	if ( combinationLength > collection.length || combinationLength < 1 ) { return []; }
	if ( combinationLength === collection.length ) { return [ collection ]; }
	if ( combinationLength === 1 ) { return collection.map( element => [element] ); }
	for ( let i = 0; i < collection.length - combinationLength + 1; i++ ) {
	  head = collection.slice( i, i + 1 );
	  tail = combinations( collection.slice( i + 1 ), combinationLength - 1 );
	  for ( let j = 0; j < tail.length; j++ ) { result.push( head.concat( tail[ j ] ) ); }
	}
	return result;
  }

