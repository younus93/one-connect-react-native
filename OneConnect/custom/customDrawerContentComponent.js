import React from 'react';
import { Text, View, StyleSheet, Image, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../constants';
import Button from '../custom/button';

export default class CustomDrawerContentComponent extends React.Component {
    navigateToScreen = (route, props=null) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params: props
        });
        this.props.navigation.dispatch(navigateAction);
    }

    _signOut = () => {
        AsyncStorage.removeItem('@appKey')
        .then(response => {
            console.log("token successfully removed")
            this.props.navigation.navigate('Login')
            //TODO: log out
        })
        .catch(error => {
            console.log("error logging out")
            //TODO: show error
        })
    }

    render() {
        const iconSize = 18
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <ImageBackground style={styles.image} source={require('../resources/Beebuck_Logo.png')} imageStyle={{resizeMode: 'contain'}}>
                    </ImageBackground>
                </View>
                <View style={styles.body}>
                    <Button onPress={this.navigateToScreen('Profile')} rippleColor={Colors.primaryLight}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="user" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>Profile</Text>
                            </View>
                        </View>
                    </Button>

                    <Button onPress={this.navigateToScreen('Batch')}rippleColor={Colors.primaryLight}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="th-list" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>Batches</Text>
                            </View>
                        </View>
                    </Button>

                    <Button onPress={this.navigateToScreen('ChangePassword')} rippleColor={Colors.primaryLight}>
                        <View style={styles.item}>
                            <View style={styles.icon}>
                                <Icon name="key" size={iconSize} color={Colors.primaryDark} />
                            </View>
                            <View style={styles.textBody}>
                                <Text style={styles.bodyTextstyle}>Change Password</Text>
                            </View>
                        </View>
                    </Button>
                </View>

                <Button style={styles.footer} onPress={this.navigateToScreen('AuthLoading', {action: 'logout'})} rippleColor={Colors.primaryLight}>
                    <View>
                        <SafeAreaView forceInset={{ bottom: 'always'}}>
                            <Text style={styles.signOut}>Sign Out</Text>
                        </SafeAreaView>
                    </View>
                </Button>

            </View>
        )
    }
}


// <Button onPress={this.navigateToScreen('Settings')} rippleColor={Colors.primaryLight}>
//     <View style={styles.item}>
//         <View style={styles.icon}>
//             <Icon name="cog" size={iconSize} color={Colors.primaryDark} />
//         </View>
//         <View style={styles.textBody}>
//             <Text style={styles.bodyTextstyle}>Settings</Text>
//         </View>
//     </View>
// </Button>
//
// <Button onPress={this.navigateToScreen('Courses')} rippleColor={Colors.primaryLight}>
//     <View style={styles.item}>
//         <View style={styles.icon}>
//             <Icon name="book-open" size={iconSize} color={Colors.primaryDark} />
//         </View>
//         <View style={styles.textBody}>
//             <Text style={styles.bodyTextstyle}>Courses</Text>
//         </View>
//     </View>
// </Button>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  image: {
      width: '100%',
      height: '100%',
      justifyContent: "center",
  },
  header: {
      backgroundColor: Colors.primary,
      opacity: 0.8,
      height: '20%'
  },
  body: {
      // marginVertical: 20
      flex: 1
  },
  item: {
      flexDirection: 'row',
      // paddingLeft: 15,
      padding: 20,
      alignItems: 'center',
  },
  textBody: {
      flex: 1,
      marginLeft: 20,
  },
  icon: {
      width: 25,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  bodyTextstyle: {
      fontSize: 16,
      fontWeight: '600',
  },
  footer: {
      backgroundColor: Colors.primaryDark,
      // marginTop: 'auto',
      padding: 15
  },
  signOut: {
      textAlign: 'center',
      fontWeight: '700',
      //paddingTop: 10,
      fontSize: 20,
      color: Colors.onPrimary
  }
});
