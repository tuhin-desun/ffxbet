import React from "react";
import Loader from "../component/Loader";
import { removeCustomerData } from "../utils/Util";
import { removeDeviceToken } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class Logout extends React.Component {
	static contextType = AppContext;

	componentDidMount = () => {
		let { customerData } = this.context;
		let obj = { cust_code: customerData.cust_code };

		removeDeviceToken(obj)
			.then((reponse) => {
				removeCustomerData();
				this.context.unsetCustomerData();
			})
			.catch((error) => console.log(error));
	};

	render = () => <Loader />;
}
