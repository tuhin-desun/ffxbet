import React from "react";
import AppContext from "./AppContext";

export default class GlobalState extends React.Component {
	constructor(props) {
		super(props);

		this.setCustomerData = (data) => this.setState({ customerData: data });

		this.unsetCustomerData = () => this.setState({ customerData: null });

		this.setAppSettings = (data) => this.setState({ appSettings: data });

		this.state = {
			customerData: props.persistCustomerData,
			appSettings: props.appSettings,
			setCustomerData: this.setCustomerData,
			unsetCustomerData: this.unsetCustomerData,
			setAppSettings: this.setAppSettings,
		};
	}

	render = () => (
		<AppContext.Provider value={this.state}>
			{this.props.children}
		</AppContext.Provider>
	);
}
