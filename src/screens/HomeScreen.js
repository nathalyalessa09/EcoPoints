import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { categories, currentUser } from '../data/mockData';
import CategoryCard from '../components/CategoryCard';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {currentUser.name.split(' ')[0]} 👋</Text>
            <Text style={styles.subGreeting}>Vamos reciclar hoje?</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.replace('Auth')}
          >
            <MaterialCommunityIcons name="logout" size={20} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Card de pontos */}
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Seu saldo</Text>
            <Text style={styles.pointsValue}>{currentUser.totalPoints} pts</Text>
            <Text style={styles.pointsSub}>
              {currentUser.itemsRecycled} itens reciclados até agora
            </Text>
          </View>
          <View style={styles.qrIconWrapper}>
            <MaterialCommunityIcons name="qrcode" size={30} color={colors.white} />
          </View>
        </View>

        {/* Ações rápidas */}
        <View style={styles.actionsRow}>
          <CustomButton
            title="Pontos de coleta"
            onPress={() => navigation.navigate('CollectionPoints')}
            style={styles.actionButton}
          />
          <CustomButton
            title="Meus vouchers"
            variant="outline"
            onPress={() => navigation.navigate('Vouchers')}
            style={styles.actionButton}
          />
        </View>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias de materiais</Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              onPress={() => navigation.navigate('CollectionPoints', { category: cat.label })}
            />
          ))}
        </View>

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="leaf" size={22} color={colors.primaryDark} />
          <Text style={styles.infoBannerText}>
            Cada produto reciclado gera pontos automaticamente ao ser inserido em uma
            máquina de coleta parceira.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: colors.text },
  subGreeting: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pointsCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsLabel: { color: colors.primaryLight, fontSize: 12, fontWeight: '600' },
  pointsValue: { color: colors.white, fontSize: 30, fontWeight: '800', marginTop: 4 },
  pointsSub: { color: colors.primaryLight, fontSize: 11, marginTop: 4 },
  qrIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionButton: { flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight + '55',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
  },
  infoBannerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
  },
});
