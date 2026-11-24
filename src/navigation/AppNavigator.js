
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
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

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// Navegação por abas inferiores
function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 62,
          paddingBottom: 7,
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name={{
              Home: 'home-outline',
              CollectionPoints: 'map-marker-radius-outline',
              Vouchers: 'ticket-percent-outline',
              Impact: 'leaf-outline',
            }[route.name]}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />

      <Tabs.Screen
        name="CollectionPoints"
        component={CollectionPointsScreen}
        options={{ title: 'Coletas' }}
      />

      <Tabs.Screen
        name="Vouchers"
        component={VouchersScreen}
        options={{ title: 'Vouchers' }}
      />

      <Tabs.Screen
        name="Impact"
        component={ImpactScreen}
        options={{ title: 'Impacto' }}
      />
    </Tabs.Navigator>
  );
}

// Navegação principal com controle de autenticação
export default function AppNavigator() {
  const { user, initializing } = useAuth();

  // Aguarda a verificação da sessão pelo Firebase
  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F1F8F3',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#214D36"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={MainTabs}
            />

            <Stack.Screen
              name="PointDetails"
              component={PointDetailsScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
