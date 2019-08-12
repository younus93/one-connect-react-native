import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
// import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
// import { Transition } from 'react-native-reanimated';

import Drawer from "./navigators/drawerNavigator";
import LoginScreen from "./screens/login";
import AuthLoading from "./screens/authLoading";
import ForgotPassword from "./screens/forgotPassword";
import { mapping, light as lightTheme } from "@eva-design/eva";
import { ApplicationProvider, Layout } from "react-native-ui-kitten";

const navigatorConfig = {
  initialRouteName: "AuthLoading"
  // transition: (
  //     <Transition.Together>
  //         <Transition.Out
  //         type="slide-top"
  //         durationMs={200}
  //         interpolation="easeIn"
  //         />
  //         <Transition.In type="slide-bottom" durationMs={400} />
  //         <Transition.In type="fade" durationMs={300} />
  //     </Transition.Together>
  // ),
};

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: {
      screen: AuthLoading
    },
    Login: {
      screen: LoginScreen
    },
    Drawer: {
      screen: Drawer
    },
    ForgotPassword: {
        screen: ForgotPassword
    }
    
  },
  navigatorConfig
);

const AppContainer = createAppContainer(RootNavigator);
class App extends React.Component {
  render() {
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <AppContainer />
      </ApplicationProvider>
    );
  }
}
export default App;
