import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { vouchers as initialVouchers } from '../data/mockData';
import VoucherCard from '../components/VoucherCard';

export default function VouchersScreen({ navigation }) {
  const [vouchers, setVouchers] = useState(initialVouchers);

  function handleRedeem(voucher) {
    Alert.alert(
      'Resgatar voucher',
      `Deseja resgatar "${voucher.discount}" em ${voucher.partner}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setVouchers((prev) =>
              prev.map((v) => (v.id === voucher.id ? { ...v, status: 'usado' } : v))
            );
          },
        },
      ]
    );
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus vouchers</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <VoucherCard voucher={item} onRedeem={handleRedeem} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Você ainda não possui vouchers.</Text>
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
    paddingBottom: 16,
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
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 30,
    fontSize: 13,
  },
});
