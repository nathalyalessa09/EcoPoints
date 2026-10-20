import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import * as Location from 'expo-location';
import { collectionPoints } from '../data/mockData';
import CustomInput from '../components/CustomInput';
import CollectionPointCard from '../components/CollectionPointCard';

export default function CollectionPointsScreen({ navigation, route }) {
  const initialCategory = route.params?.category;
  const [search, setSearch] = useState(initialCategory ?? '');

  const filteredPoints = useMemo(() => {
    if (!search.trim()) return collectionPoints;
    const term = search.trim().toLowerCase();
    return collectionPoints.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.materials.some((m) => m.toLowerCase().includes(term))
    );
  }, [search]);

  const [gpsMessage, setGpsMessage] = useState('');
  async function requestLocation() {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setGpsMessage('Permissão de localização negada. Você ainda pode consultar os pontos demonstrativos.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setGpsMessage(`GPS obtido: ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}. Pontos exibidos são fictícios e não foram calculados com base nessa posição.`);
    } catch (error) { setGpsMessage('Não foi possível obter a localização. Verifique o GPS do dispositivo.'); }
  }
  function handleSelectPoint(point) { navigation.navigate('PointDetails', {point}); }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pontos de coleta</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.searchWrapper}>
        <CustomInput
          label="Buscar por local ou material"
          placeholder="Ex: Plástico, Supermercado..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity onPress={requestLocation} style={{padding:12,marginHorizontal:20,backgroundColor:colors.primaryLight,borderRadius:12,marginBottom:8}}>
        <Text style={{color:colors.primaryDark,fontWeight:'700'}}>📍 Usar GPS do celular</Text>
      </TouchableOpacity>
      {!!gpsMessage && <Text style={{marginHorizontal:20,marginBottom:10,color:colors.textLight,fontSize:12}}>{gpsMessage}</Text>}
      <Text style={{marginHorizontal:20,marginBottom:10,color:colors.textLight,fontSize:11}}>Locais e distâncias demonstrativos — não representam estabelecimentos reais.</Text>
      <FlatList
        data={filteredPoints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CollectionPointCard point={item} onPress={() => handleSelectPoint(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum ponto encontrado para essa busca.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  searchWrapper: { paddingHorizontal: 20 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 30,
    fontSize: 13,
  },
});
