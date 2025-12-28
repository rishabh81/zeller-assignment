/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, TouchableOpacity, useColorScheme, Text } from 'react-native';
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
import AddCustomer from './screens/AddCustomer/AddCustomer.screen';
import { TRootStackParamList } from './types';
import { colors } from './theme/colors';
import EditCustomer from './screens/EditCustomer/EditCustomer.screen';
enableScreens();

const Stack = createNativeStackNavigator<TRootStackParamList>();

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
            <Stack.Screen 
              name='AddCustomer'
              component={AddCustomer}
              options={({navigation}) => ({
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={styles.crossButtonText}>X</Text>
                  </TouchableOpacity>
                ),
                headerTitle:'',
                headerShadowVisible: false,
                presentation:'modal'
              })}
            />

            <Stack.Screen 
              name='EditCustomer'
              component={EditCustomer}
              options={({navigation}) => ({
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text style={styles.crossButtonText}>X</Text>
                  </TouchableOpacity>
                ),
                headerTitle:'',
                headerShadowVisible: false,
                presentation:'modal'
              })}
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
  crossButtonText: {
    color: colors.blueDark,
    fontSize: 20
  },
  crossButton: {
    padding:20,
  }
});

export default App;
