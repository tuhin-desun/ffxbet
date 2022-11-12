import React from "react";

export default React.createContext({
	customerData: null,
	appSettings: null,
	setCustomerData: (data) => {},
	unsetCustomerData: () => {},
	setAppSettings: (data) => {},
});
