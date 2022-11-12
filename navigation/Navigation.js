import * as React from "react";
import { useContext } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { Avatar, Title, Caption } from "react-native-paper";
import Colors from "../config/colors";
import { shareApp } from "../utils/Util";
import AppContext from "../context/AppContext";

import Registration from "../screen/registration";
import Dashboard from "../screen/dashboard";
import OtpVerification from "../screen/otpVerification";
import MyBid from "../screen/myBid";
import GameResult from "../screen/gameResult";
import Login from "../screen/login";
import More from "../screen/more";
import Contact from "../screen/contact";
import Game from "../screen/games";
import GameType from "../screen/gameType";
import Play from "../screen/play";
import PlayHistory from "../screen/playHistory";
import ViewResult from "../screen/viewResult";
import AddBalance from "../screen/addBalance";
import WithdrawBalance from "../screen/withdrawBalance";
import UpdateAccount from "../screen/updateAccount";
import GameRules from "../screen/gameRules";
import DepositHistory from "../screen/depositHistory";
import WithdrawHistory from "../screen/withdrawHistory";
import Logout from "../screen/Logout";
import VerifyAccount from "../screen/VerifyAccount";
import ResetPassword from "../screen/ResetPassword";
import Transactions from "../screen/Transactions";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();
const activeIconSize = 22;
const inactiveIconSize = 20;

const TabNavigation = () => (
  <Tab.Navigator
    initialRouteName="Home"
    labeled={true}
    shifting={false}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        let iconSize;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
          iconSize = focused ? activeIconSize : inactiveIconSize;
        } else if (route.name === "My Bid") {
          iconName = focused ? "bar-chart" : "bar-chart-outline";
          iconSize = focused ? activeIconSize : inactiveIconSize;
        } else if (route.name === "Game Result") {
          iconName = focused ? "game-controller" : "game-controller-outline";
          iconSize = focused ? activeIconSize : inactiveIconSize;
        } else if (route.name === "Contact") {
          iconName = focused ? "call" : "call-outline";
          iconSize = focused ? activeIconSize : inactiveIconSize;
        } else if (route.name === "More") {
          iconName = focused ? "apps-outline" : "apps";
          iconSize = focused ? activeIconSize : inactiveIconSize;
        }

        return focused ? (
          <>
            <View
              style={{
                borderTopWidth: 3,
                width: 100,
                borderColor: Colors.secondary,
                top: -8,
              }}
            ></View>
            <View style={{}}>
              <Ionicons
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                name={iconName}
                size={iconSize}
                color={color}
              />
            </View>
          </>
        ) : (
          <Ionicons name={iconName} size={iconSize} color={color} />
        );
      },
    })}
    activeColor={Colors.secondary}
    inactiveColor={Colors.inactiveTabLabel}
    barStyle={{ backgroundColor: Colors.primary }}
  >
    <Tab.Screen name="Home" component={Dashboard} />
    <Tab.Screen name="My Bid" component={MyBid} />
    <Tab.Screen name="Game Result" component={GameResult} />
    <Tab.Screen name="Contact" component={Contact} />
    <Tab.Screen name="More" component={More} />
  </Tab.Navigator>
);

const CustomDrawerContent = (props) => {
  const context = useContext(AppContext);

  const onShare = () => {
    props.navigation.closeDrawer();
    let settings = context.appSettings;
    let contentObj = { message: settings.share_msg };
    shareApp(contentObj);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={{ marginTop: -5, backgroundColor: Colors.primary }}>
          <View style={styles.userInfoSection}>
            <Avatar.Image
              source={require("../assets/blank-profile-picture.png")}
              size={50}
            />
            <Title style={styles.title}>
              {context.customerData !== null
                ? context.customerData.full_name
                : ""}
            </Title>
            <Caption style={styles.caption}>
              ID:{" "}
              {context.customerData !== null
                ? context.customerData.cust_code
                : ""}
            </Caption>
          </View>
        </View>

        <DrawerItemList {...props} />

        <TouchableHighlight underlayColor={Colors.secondary} onPress={onShare}>
          <View style={styles.shareBtn}>
            <Ionicons name="share-social" size={24} color={Colors.primary} />
            <Text style={styles.shareText}>SHARE APP</Text>
          </View>
        </TouchableHighlight>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNav = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContentOptions={{
      inactiveTintColor: Colors.primary,
      activeTintColor: Colors.white,
      activeBackgroundColor: Colors.secondary,
      itemStyle: { marginVertical: 5 },
      backgroundColor: "#DBDBE3",
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Home"
      component={TabNavigation}
      //style={{backgroundColor:'#DBDBE3'}}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "HOME" : "HOME"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <Ionicons name="md-home" size={20} color={focused ? "#fff" : color} />
        ),
      }}
    />

    <Drawer.Screen
      name="Add Balance"
      component={AddBalance}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "ADD BALANCE" : "ADD BALANCE"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <Ionicons name="wallet" size={24} color={focused ? "#fff" : color} />
        ),
      }}
    />

    <Drawer.Screen
      name="Withdraw Balance"
      component={WithdrawBalance}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "WITHDRAW BALANCE" : "WITHDRAW BALANCE"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <MaterialCommunityIcons
            name="application-export"
            size={24}
            color={focused ? "#fff" : color}
          />
        ),
      }}
    />

    <Drawer.Screen
      name="Update Account"
      component={UpdateAccount}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "UPDATE ACCOUNT" : "UPDATE ACCOUNT"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <MaterialCommunityIcons
            name="account-edit"
            size={24}
            color={focused ? "#fff" : color}
          />
        ),
      }}
    />

    <Drawer.Screen
      name="Deposit History"
      component={DepositHistory}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "DEPOSIT HISTORY" : "DEPOSIT HISTORY"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <Ionicons name="today" size={24} color={focused ? "#fff" : color} />
        ),
      }}
    />

    <Drawer.Screen
      name="Withdraw History"
      component={WithdrawHistory}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "WITHDRAW HISTORY" : "WITHDRAW HISTORY"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <Ionicons
            name="calendar"
            size={24}
            color={focused ? "#fff" : color}
          />
        ),
      }}
    />

    <Drawer.Screen
      name="Transaction History"
      component={Transactions}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "TRANSACTION HISTORY" : "TRANSACTION HISTORY"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <Entypo
            name="back-in-time"
            size={24}
            color={focused ? "#fff" : color}
          />
        ),
      }}
    />

    <Drawer.Screen
      name="Contact Us"
      component={Contact}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "HELPLINE" : "HELPLINE"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <Ionicons name="call" size={24} color={focused ? "#fff" : color} />
        ),
      }}
    />

    <Drawer.Screen
      name="Logout"
      component={Logout}
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text style={{ color, marginLeft: -10 }}>
            {focused ? "LOGOUT" : "LOGOUT"}
          </Text>
        ),
        drawerIcon: ({ focused, color }) => (
          <MaterialCommunityIcons
            name="power"
            size={26}
            color={focused ? "#fff" : color}
          />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default class Navigation extends React.Component {
  static contextType = AppContext;

  render = () => (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={this.context.customerData === null ? "Login" : "Home"}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {this.context.customerData === null ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="OtpVerification" component={OtpVerification} />
            <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={DrawerNav} />
            <Stack.Screen name="GameType" component={GameType} />
            <Stack.Screen name="Game" component={Game} />
            <Stack.Screen name="Play" component={Play} />
            <Stack.Screen name="PlayHistory" component={PlayHistory} />
            <Stack.Screen name="Game Rules" component={GameRules} />
            <Stack.Screen name="Game Result" component={GameResult} />
            <Stack.Screen name="View Result" component={ViewResult} />
            <Stack.Screen name="Logout" component={Logout} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    marginVertical: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  caption: {
    fontSize: 16,
    color: Colors.white,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  shareBtn: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  shareText: {
    marginLeft: 20,
    fontSize: 14,
    color: Colors.primary,
  },
});
