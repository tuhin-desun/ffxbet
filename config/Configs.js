const PRODUCTION = true;

export default {
	PHONE_NUMBER_COUNTRY_CODE: "+91",
	BASE_URL: PRODUCTION
		? "http://ffxbet.in/software/api/"
		: "https://ehostingguru.com/stage/ffwinner/api/",
	IMAGE_URL: PRODUCTION ? "http://ffxbet.in/software/uploads/" : "https://ehostingguru.com/stage/ffwinner/uploads/",	
	SUCCESS_TYPE: "success",
	FAILURE_TYPE: "failure",
	BID_TYPE_SINGLE: "Single",
	BID_TYPE_PATTI: "Patti",
	BID_TYPE_JODI: "Jodi",
	BID_TYPE_CP: "CP",
	PURPOSE_SIGNUP: "SignUp",
	PURPOSE_RESET_PASSWORD: "Reset Password",
	GAME_SETTINGS_IMAGE_URL: "http://ffxbet.in/software/uploads/logo/",
	TRANSACTION_MODES: [
		{
			key: "bank_account",
			value: "Bank Account",
		},
		{
			key: "gpay",
			value: "GPay",
		},
		{
			key: "paytm",
			value: "Paytm",
		},
		{
			key: "phonepe",
			value: "PhonePe",
		},
		{
			key: "upi",
			value: "UPI",
		},
	],
	ADD_BALANCE_STATUS: {
		P: "Pending",
		S: "Success",
		F: "Failed",
	},
	GAME_PLAY_STATUS: {
		P: {
			label: "Pending",
			bgcolor: "#ffc107",
		},
		W: {
			label: "Win",
			bgcolor: "#89C35C",
		},
		L: {
			label: "Loss",
			bgcolor: "#ff5252",
		},
	},
};
