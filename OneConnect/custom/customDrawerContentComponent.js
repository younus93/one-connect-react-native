import React from 'react';
import { Text, View, Button, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ScrollView , SafeAreaView, NavigationActions} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CustomDrawerContentComponent extends React.Component {
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.header}></View>
                <View style={styles.body}>
                    <View style={styles.item}>
                        <Icon name="user" size={22} color="#5E5E5E" />
                        <Text style={styles.bodyTextstyle} onPress={this.navigateToScreen('Profile')}>Profile</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon name="align-justify" size={22} color="#5E5E5E" />
                        <Text style={styles.bodyTextstyle} onPress={this.navigateToScreen('Batch')}>Batch</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon name="cog" size={22} color="#5E5E5E" />
                        <Text style={styles.bodyTextstyle} onPress={this.navigateToScreen('Settings')}>Settings</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableWithoutFeedback onPress={() => console.log("signed out")}>
                            <View>
                                <SafeAreaView forceInset={{ bottom: 'always'}}>
                                    <Text style={styles.signOut}>Sign Out</Text>
                                </SafeAreaView>
                            </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
      backgroundColor: '#677189',
      opacity: 0.8,
      height: '20%'
  },
  body: {
      marginVertical: 20
  },
  item: {
      flexDirection: 'row',
      paddingLeft: 15,
      padding: 10,
      alignItems: 'center'
  },
  bodyTextstyle: {
      fontSize: 16,
      marginLeft: 30,
      marginRight: 10
  },
  footer: {
      backgroundColor: '#677189',
      marginTop: 'auto',
  },
  signOut: {
      textAlign: 'center',
      paddingTop: 10,
      fontSize: 20,
      color: 'white'
  }
});
