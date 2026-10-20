import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import CustomButton from './CustomButton';

export default function VoucherCard({ voucher, onRedeem }) {
  const isUsed = voucher.status === 'usado';

  return (
    <View style={[styles.card, isUsed && styles.cardUsed]}>
      <View style={styles.topRow}>
        <View style={styles.pointsBadge}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={16} color={colors.white} />
          <Text style={styles.pointsText}>{voucher.points} pts</Text>
        </View>
        <Text style={styles.validUntil}>Válido até {voucher.validUntil}</Text>
      </View>

      <Text style={styles.discount}>{voucher.discount}</Text>
      <Text style={styles.partner}>{voucher.partner}</Text>

      <CustomButton
        title={isUsed ? 'Voucher utilizado' : 'Resgatar'}
        variant={isUsed ? 'outline' : 'primary'}
        onPress={() => !isUsed && onRedeem(voucher)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUsed: { opacity: 0.55 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointsText: { color: colors.white, fontSize: 12, fontWeight: '700', marginLeft: 4 },
  validUntil: { fontSize: 11, color: colors.textLight },
  discount: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 10 },
  partner: { fontSize: 13, color: colors.textLight, marginTop: 2, marginBottom: 12 },
  button: { paddingVertical: 10 },
});
