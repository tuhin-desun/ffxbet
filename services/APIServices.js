import Configs from "../config/Configs";

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};

export const signin = async (requestObj) => {
	let url = Configs.BASE_URL + "signin/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const verifyMobile = async (requestObj) => {
	let url = Configs.BASE_URL + "verify_mobile/";
	requestObj.purpose = requestObj.hasOwnProperty("purpose")
		? requestObj.purpose
		: Configs.PURPOSE_SIGNUP;

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const sendOTP = async (mobile) => {
	let url = Configs.BASE_URL + "send_otp/" + mobile;
	let response = await fetch(url);
	return await response.json();
};

export const signup = async (requestObj) => {
	let url = Configs.BASE_URL + "signup/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const resetPassword = async (requestObj) => {
	let url = Configs.BASE_URL + "reset_password/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const saveDeviceToken = async (requestObj) => {
	let url = Configs.BASE_URL + "save_device_token/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const removeDeviceToken = async (requestObj) => {
	let url = Configs.BASE_URL + "remove_device_token/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getNews = async () => {
	let url = Configs.BASE_URL + "news/";
	let response = await fetch(url);
	return await response.json();
};

export const getCarouselData = async () => {
	let url = Configs.BASE_URL + "carousel/";
	let response = await fetch(url);
	return await response.json();
};

export const getGameCategories = async () => {
	let url = Configs.BASE_URL + "categories/";
	let response = await fetch(url);
	return await response.json();
};

export const getGames = async (categoryID) => {
	let url = Configs.BASE_URL + "games/?category=" + categoryID;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getTimeDate = async () => {
	let url = Configs.BASE_URL + "gettime";
	let response = await fetch(url);
	return await response.json();
};

export const getCustomerInfo = async (mobile) => {
	let url = Configs.BASE_URL + "customer_info/" + mobile;
	let response = await fetch(url);
	return await response.json();
};

export const getWalletBalance = async (customerCode) => {
	let url = Configs.BASE_URL + "wallet_balance/" + customerCode;
	let response = await fetch(url);
	return await response.json();
};

export const addBalance = async (requestObj) => {
	let url = Configs.BASE_URL + "deposit_request/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getDepositHistory = async (customerCode) => {
	let url = Configs.BASE_URL + "deposit_history/" + customerCode;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const withdrawBalance = async (requestObj) => {
	let url = Configs.BASE_URL + "withdraw_request/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getWithdrawHistory = async (customerCode) => {
	let url = Configs.BASE_URL + "withdraw_history/" + customerCode;
	let response = await fetch(url);
	return await response.json();
};

export const editProfile = async (requestObj) => {
	let url = Configs.BASE_URL + "edit_account/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAccountInfo = async (customerCode) => {
	let url = Configs.BASE_URL + "account_info/" + customerCode;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const addBidding = async (requestObj) => {
	let url = Configs.BASE_URL + "add_bidding/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getBidHistory = async (customerCode, bidType, categoryID) => {
	let url =
		Configs.BASE_URL +
		"bid_history/?cust_code=" +
		customerCode +
		"&type=" +
		bidType +
		"&category_id=" +
		categoryID;

	let response = await fetch(url);
	return await response.json();
};

export const getGameResult = async (categoryID, activeTab) => {
	let url = Configs.BASE_URL + "game_result/?category_id=" + categoryID+"&active_tab="+activeTab;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getTransactions = async (customerCode, page) => {
	let url =
		Configs.BASE_URL +
		"transactions/?cust_code=" +
		customerCode +
		"&page=" +
		page;
		console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getAppSettings = async () => {
	let url = Configs.BASE_URL + "settings/";
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};
