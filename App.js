import { AppRegistry } from "react-native";
import React from "react";
import AppLoading from "expo-app-loading";
import * as Notifications from "expo-notifications";
import { getCustomerInfo, getAppSettings } from "./services/APIServices";
import {
  readCustomerData,
  writeCustomerData,
  removeCustomerData,
} from "./utils/Util";
import GlobalState from "./context/GlobalState";
import Navigation from "./navigation/Navigation";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      customerData: null,
      appSettings: null,
    };

    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
  }

  componentDidMount = () => {
    this.notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log(notification);
      });

    this.responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });
  };

  componentWillUnmount = () => {
    Notifications.removeNotificationSubscription(
      this.notificationListener.current
    );
    Notifications.removeNotificationSubscription(this.responseListener.current);
  };

  loadPersistantData = () => {
    readCustomerData().then((data) => {
      if (data !== null) {
        Promise.all([getAppSettings(), getCustomerInfo(data.mobile)])
          .then((response) => {
            let settings = response[0];
            let cusData = response[1];
            console.log(cusData);
            console.log(settings);

            if (cusData === null) {
              removeCustomerData();
            } else {
              writeCustomerData(cusData);
            }

            this.setState({
              appSettings: settings,
              customerData: cusData,
              isReady: true,
            });
          })
          .catch((error) => console.log(error));
      } else {
        getAppSettings()
          .then((settings) => {
            this.setState({
              appSettings: settings,
              isReady: true,
            });
          })
          .catch((error) => console.log(error));
      }
    });
  };

  onFinish = () => null;

  render = () =>
    this.state.isReady ? (
      <GlobalState
        appSettings={this.state.appSettings}
        persistCustomerData={this.state.customerData}
      >
        <Navigation />
      </GlobalState>
    ) : (
      <AppLoading
        startAsync={this.loadPersistantData}
        onFinish={this.onFinish}
        onError={console.log}
      />
    );
}

AppRegistry.registerComponent("FF X BET", () => point);
