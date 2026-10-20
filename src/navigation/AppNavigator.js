import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import CollectionPointsScreen from '../screens/CollectionPointsScreen';
import VouchersScreen from '../screens/VouchersScreen';
import ImpactScreen from '../screens/ImpactScreen';
import PointDetailsScreen from '../screens/PointDetailsScreen';
const Stack=createNativeStackNavigator();
const Tabs=createBottomTabNavigator();
function MainTabs(){return <Tabs.Navigator screenOptions={({route})=>({headerShown:false,tabBarActiveTintColor:colors.primaryDark,tabBarInactiveTintColor:colors.textLight,tabBarStyle:{backgroundColor:colors.white,height:62,paddingBottom:7},tabBarIcon:({color,size})=><MaterialCommunityIcons name={({Home:'home-outline',CollectionPoints:'map-marker-radius-outline',Vouchers:'ticket-percent-outline',Impact:'leaf-outline'})[route.name]} color={color} size={size}/>})}>
<Tabs.Screen name="Home" component={HomeScreen} options={{title:'Início'}}/>
<Tabs.Screen name="CollectionPoints" component={CollectionPointsScreen} options={{title:'Coletas'}}/>
<Tabs.Screen name="Vouchers" component={VouchersScreen} options={{title:'Vouchers'}}/>
<Tabs.Screen name="Impact" component={ImpactScreen} options={{title:'Impacto'}}/>
</Tabs.Navigator>}
export default function AppNavigator(){return <NavigationContainer><Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Auth"><Stack.Screen name="Auth" component={AuthScreen}/><Stack.Screen name="Home" component={MainTabs}/><Stack.Screen name="PointDetails" component={PointDetailsScreen}/></Stack.Navigator></NavigationContainer>}
