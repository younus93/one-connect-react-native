import React from "react";
import { View, Text, Button } from "react-native";


export default class Settings extends React.Component {
    // static navigationOption: {
    //     title: 'Settings',
    //     headerTransparent: false,
    //     headerStyle: {
    //         backgroundColor: '#677189'
    //     }
    // }

    render() {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Settings</Text>
          <Button onPress={() => this.props.navigation.navigate('Profile')} title="Feed" color="blue"/>
        </View>
      );
    }
}



// class ProfileList extends React.Component {
//     constructor(props) {
//         super(props)
//         let {user} = props
//         let profileDetails = [{
//             title: 'User details',
//             data: [
//                 {'Name':user.f_name + " " + user.family_name},
//                 {'Mobile': user.phone_number},
//                 {'Email': user.email},
//                 {'Privacy Settings': user.privacy_setting}
//             ]
//         }]
//
//         this.state = {
//             user: profileDetails
//         }
//     }
//
//     _renderItem = ({item, index, section}) => {
//         console.log("item is ", item)
//         let key = Object.keys(item)
//         return(
//             <View style={styles.item}>
//                 <Text key={`prle-${index}`} style={styles.itemsTextLabel}>{key}</Text>
//                 <Text key={`prle-${index+1}`} style={styles.itemsText}>{item[key[0]]}</Text>
//             </View>
//         )
//     }
//
//     _renderSection = ({section: {title}}) => {
//         return (
//             <View>
//                 <Text style={{fontWeight: 'bold'}}>{title}</Text>
//             <View>
//         )
//     }
//
//     _keyExtractor = (item, index) => `prle-${index}`;
//
//     render() {
//         let {user} = this.state
//         return(
//
//             <SectionList
//                 renderItem={this._renderItem}
//                 renderSectionHeader={this._renderSection}
//                 sections={user}
//                 keyExtractor={this._keyExtractor}
//             />
//         )
//     }
// }
