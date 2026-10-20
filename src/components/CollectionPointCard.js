import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CollectionPointCard({ point, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name="map-marker-radius" size={26} color={colors.white} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{point.name}</Text>
        <Text style={styles.address}>{point.address}</Text>

        <View style={styles.tagsRow}>
          {point.materials.map((m) => (
            <View key={m} style={styles.tag}>
              <Text style={styles.tagText}>{m}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.distance}>{point.distanceKm.toFixed(1)} km</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSoft,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  address: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginTop: 4,
  },
  tagText: { fontSize: 10, fontWeight: '600', color: colors.primaryDark },
  distance: { fontSize: 12, fontWeight: '700', color: colors.secondary, marginLeft: 8 },
});
