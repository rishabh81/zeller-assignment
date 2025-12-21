/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { apolloClient } from './services/GraphQL.Service';
import { CustomerListScreen } from './screens/CustomerList/CustomerList.screen';
import { ApolloProvider } from '@apollo/client/react';
import { enableScreens } from 'react-native-screens';
import { useEffect } from 'react';
import { databaseService } from './services/database/DatabaseService';
enableScreens();

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {

  useEffect(() => {
    const initializeApp =async () => {
      try {
        await databaseService.init();
      } catch(e) {
        console.error('db initialization failed', e)
      }
    }
    initializeApp()
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='CustomerList'>
          <Stack.Screen 
            name='CustomerList'
            component={CustomerListScreen}
            options={{
              headerShown: false
            }}
            />
        </Stack.Navigator>
      </NavigationContainer>

    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
