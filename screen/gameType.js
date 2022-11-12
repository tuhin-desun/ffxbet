import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../component/Header";
import Loader from "../component/Loader";
import { getGames, getTimeDate } from "../services/APIServices";
import { checkGameAvailabilityy } from "../utils/Util";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Configs from "../config/Configs";

const GAME_TYPE = [
    {
        "id": 1,
        "name": "Single",
        "bg": "#FE5722",
        "border": "#f99c00",
        "image": `${Configs.IMAGE_URL}/single.png`
    },
    {
        "id": 2,
        "bg": "#00cb00",
        "border": "#08ff00",
        "name": "Patti",
        "image": `${Configs.IMAGE_URL}/patti.png`
    },
    {
        "id": 3,
        "bg": "#602AB6",
        "name": "Jodi",
        "border": "#8430c8",
        "image": `${Configs.IMAGE_URL}/jodi.png`
    },
    {
        "id": 4,
        "bg": "#EA1E63",
        "border": "#ff77aa",
        "name": "CP",
        "image":`${Configs.IMAGE_URL}/cp.png`
    },
]

export default class GameType extends React.Component {
    state = {
        games: [],
        isLoading: false,
        categoryID: this.props.route.params.category_id,
        categoryName: this.props.route.params.category_name,
        next_game_code: this.props.route.params.next_game_code,
        is_last: this.props.route.params.is_last,
        today: moment().format("YYYY-MMM-DD"),
        currentDateTime: moment().format("YYYY-MMM-DD HH:mm:ss"),
        game_id: this.props.route.params.game_id,
        game_code: this.props.route.params.game_code,
        game_title: this.props.route.params.game_title,
        start_time: this.props.route.params.start_time,
        end_time: this.props.route.params.end_time,
        minum_coin: this.props.route.params.minum_coin,
        hours: undefined,
        mins: undefined,
    };

    componentDidMount = () => {
        this.updateTimer();
    };

    updateTimer = () => {
        this.interval = setInterval(() => {
            let mm = moment
                .duration(moment(this.state.end_time, "HH:mm:ss").diff(moment()))
                .asMinutes();
            mm = Math.floor(mm);

            if (mm <= 0) {
                clearInterval(this.interval);
            } else {
                this.setState({
                    hours: Math.floor(mm / 60),
                    mins: mm % 60,
                });
            }
        }, 1000);
    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    gotoGamePlay = (item) => {
        const { game_id, game_code, game_title, start_time, end_time, minum_coin, next_game_code, is_last } = this.state;
        this.props.navigation.navigate("Play", {
            game_id: game_id,
            game_code: game_code,
            game_title: game_title,
            start_time: start_time,
            end_time: end_time,
            minum_coin: minum_coin,
            bid_type: item,
            next_game_code: next_game_code,
            is_last: is_last,
        });
    };

    gotoGameList = () => {
        const { categoryID, categoryName } = this.state;
        this.props.navigation.navigate("Game", {
            category_id: categoryID,
            category_name: categoryName,
        });
    };

    renderItem = ({ item }) => {
        if (this.state.is_last && item.name == 'Jodi') {
            return null;
        }
        return (
            <TouchableOpacity style={[styles.grid, { backgroundColor: item.bg, borderColor: item.border }]}
                onPress={this.gotoGamePlay.bind(this, item.name)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.imageStyle}
                        resizeMode={"contain"}
                    />
                </View>
                <Text style={styles.mText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    getListEmptyComponent = () => (
        <View style={styles.lisEmptyContainer}>
            <Text style={styles.listEmptyText}>Game is closed for today</Text>
        </View>
    );

    gotoBack = () => this.props.navigation.goBack();

    render = () => (
        <View style={styles.container}>
            <Header
                leftIconName={"arrow-back"}
                rightIconName={"wallet-outline"}
                title={this.state.categoryName}
                leftButtonFunc={this.gotoBack}
                {...this.props}
            />

            {this.state.isLoading ? (
                <Loader />
            ) : (
                <View>
                    <View style={styles.labelContainer}>
                        <Text style={{ color: Colors.black, fontWeight: 'bold' }}>
                            Closed in {" "}
                        </Text>
                        {typeof this.state.hours !== "undefined" ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons
                                    name="clock"
                                    size={24}
                                    color={Colors.black}
                                />
                                <Text style={{ color: Colors.black, fontWeight: 'bold' }}>
                                    {this.state.hours + " Hr " + this.state.mins + " min"}
                                </Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.loaderText}>Loading... </Text>
                                <ActivityIndicator size="small" color={Colors.primary} />
                            </View>
                        )}

                    </View>
                    {/* <View style={styles.content}>
                        {GAME_TYPE.map(item =>
                            <TouchableOpacity key={Math.random()} style={[styles.grid, { backgroundColor: item.bg }]}
                            onPress={this.gotoGamePlay.bind(this, item.name)}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.imageStyle}
                                        resizeMode={"contain"}
                                    />
                                </View>
                                <Text style={styles.mText}>{item.name}</Text>
                            </TouchableOpacity>

                        )}
                    </View> */}

                    <FlatList
                        ListEmptyComponent={() => this.getListEmptyComponent()}
                        data={GAME_TYPE}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.renderItem}
                        initialNumToRender={GAME_TYPE.length}
                        refreshing={this.state.isLoading}
                        numColumns={2}
                        contentContainerStyle={
                            GAME_TYPE.length === 0 ? styles.container : null
                        }
                    />
                </View>

            )}
        </View>
    );
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lisEmptyContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
    },
    listEmptyText: {
        fontSize: 16,
        color: Colors.danger,
    },
    card: {
        width: windowWidth - 16,
        backgroundColor: Colors.secondary,
        borderRadius: (windowWidth - 16) / 2,
        height: 100,
        padding: 10,
        marginHorizontal: 8,
        marginVertical: 25,
        shadowColor: Colors.dark,
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 2.0,
        elevation: 5,
        justifyContent: 'center'
    },
    detailsContainer: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 5,
    },
    imageContainer: {
        width: "40%",
        alignItems: "flex-start",
        justifyContent: "center",
        alignItems: 'center',
        
    },
    imageStyle: {
        height: 100,
        width: 100,
        alignItems: "center",
    },
    titleContainer: {
        width: "60%",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    titleTextStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white
    },
    btnContainer: {
        width: "25%",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    btn: {
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: Colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btnTextStyle: {
        color: Colors.white,
        fontWeight: "bold",
    },
    labelContainer: {
        width: windowWidth - 16,
        backgroundColor: Colors.secondary,
        borderRadius: 2,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 8,
        marginVertical: 25,
        shadowColor: Colors.dark,
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 2.0,
        elevation: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },


    content: {
        //marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        flexWrap: "wrap",
    },


    grid: {
        //width: 180,
        width: Math.floor((windowWidth - 45) / 2),
        height: Math.floor((windowWidth - 45) / 2),
        // width:80,
        //height:80,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        margin: 10,
        padding: 5,
        borderRadius: 50,
        borderWidth: 6,
        borderColor: '#ffca16'
      
        //backgroundColor:'#9492d4'
    },

    mText: {
        fontSize: 18,
        fontFamily: 'serif',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },

});
