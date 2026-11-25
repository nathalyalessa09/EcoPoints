
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import CustomButton from '../components/CustomButton';

import {
  createRecyclingRecord,
  subscribeToRecyclingRecords,
  updateRecyclingRecord,
  deleteRecyclingRecord,
  calculateTotalItems,
  getRecyclingErrorMessage,
} from '../services/recyclingService';

const MATERIALS = [
  { label: 'Plástico', icon: 'bottle-soda-outline' },
  { label: 'Papel', icon: 'file-document-outline' },
  { label: 'Metal', icon: 'can-outline' },
  { label: 'Vidro', icon: 'bottle-wine-outline' },
];

export default function RecyclingScreen({ navigation }) {
  const [records, setRecords] = useState([]);
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Consulta os registros em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToRecyclingRecords(
      (data) => {
        setRecords(data);
        setLoading(false);
      },
      (err) => {
        setError(getRecyclingErrorMessage(err));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const totalItems = calculateTotalItems(records);

  // Limpa os campos do formulário
  function resetForm() {
    setMaterial('');
    setQuantity('');
    setEditingId(null);
  }

  // CREATE e UPDATE
  async function handleSave() {
    if (saving) return;

    setError('');
    setSuccess('');

    if (!material) {
      setError('Selecione um material.');
      return;
    }

    const parsedQuantity = Number(quantity);

    if (
      !/^\d+$/.test(quantity.trim()) ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      parsedQuantity > 1000
    ) {
      setError('Informe uma quantidade entre 1 e 1000.');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateRecyclingRecord(
          editingId,
          material,
          parsedQuantity
        );

        setSuccess('Registro atualizado com sucesso!');
      } else {
        await createRecyclingRecord(
          material,
          parsedQuantity
        );

        setSuccess('Reciclagem registrada com sucesso!');
      }

      resetForm();

    } catch (err) {
      setError(getRecyclingErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  // Preenche o formulário para edição
  function handleEdit(record) {
    if (saving) return;

    setEditingId(record.id);
    setMaterial(record.material);
    setQuantity(String(record.quantity));
    setError('');
    setSuccess('');
  }

  function handleCancelEdit() {
    resetForm();
    setError('');
    setSuccess('');
  }

  // DELETE
  async function handleDelete() {
    if (!recordToDelete || saving) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await deleteRecyclingRecord(recordToDelete.id);

      if (editingId === recordToDelete.id) {
        resetForm();
      }

      setSuccess('Registro excluído com sucesso!');
      setRecordToDelete(null);

    } catch (err) {
      setError(getRecyclingErrorMessage(err));
      setRecordToDelete(null);
    } finally {
      setSaving(false);
    }
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'Sincronizando...';

    return timestamp.toDate().toLocaleDateString('pt-BR');
  }

  function renderRecord({ item }) {
    const materialInfo = MATERIALS.find(
      (m) => m.label === item.material
    );

    return (
      <View style={styles.recordCard}>
        <View style={styles.recordIcon}>
          <MaterialCommunityIcons
            name={materialInfo?.icon || 'recycle'}
            size={24}
            color={colors.primaryDark}
          />
        </View>

        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle}>
            {item.material}
          </Text>

          <Text style={styles.recordQuantity}>
            {item.quantity} unidades
          </Text>

          <Text style={styles.recordDate}>
            {formatDate(item.createdAt)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleEdit(item)}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${item.material}`}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={22}
            color={colors.primaryDark}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setRecordToDelete(item)}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={`Excluir ${item.material}`}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={22}
            color="#B3261E"
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderHeader() {
    return (
      <View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>
              Minha contribuição ambiental
            </Text>

            <Text style={styles.summaryValue}>
              {totalItems} itens
            </Text>

            <Text style={styles.summarySubtitle}>
              Pequenas atitudes, grandes impactos.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="recycle"
            size={40}
            color={colors.primaryLight}
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingId
              ? 'Editar reciclagem'
              : 'Registrar reciclagem'}
          </Text>

          <Text style={styles.label}>
            Selecione o material
          </Text>

          <View style={styles.materialGrid}>
            {MATERIALS.map((item) => {
              const selected = material === item.label;

              return (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.materialButton,
                    selected && styles.materialSelected,
                  ]}
                  onPress={() => setMaterial(item.label)}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={colors.primaryDark}
                  />

                  <Text style={styles.materialText}>
                    {item.label}
                  </Text>

                  {selected && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color={colors.primaryDark}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>
            Quantidade de itens
          </Text>

          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ex.: 10"
            placeholderTextColor={colors.textLight}
            keyboardType="number-pad"
            maxLength={4}
            editable={!saving}
            accessibilityLabel="Quantidade de itens"
          />

          {error ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              {error}
            </Text>
          ) : null}

          {success ? (
            <Text
              style={styles.successText}
              accessibilityLiveRegion="polite"
            >
              {success}
            </Text>
          ) : null}

          <CustomButton
            title={
              editingId
                ? 'Salvar alterações'
                : 'Salvar registro'
            }
            onPress={handleSave}
            loading={saving}
            style={{ marginTop: 8 }}
          />

          {editingId && (
            <TouchableOpacity
              style={styles.cancelEdit}
              onPress={handleCancelEdit}
              disabled={saving}
              accessibilityRole="button"
            >
              <Text style={styles.cancelEditText}>
                Cancelar edição
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>
            Meu histórico
          </Text>

          <Text style={styles.historyCount}>
            {records.length} registros
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.primaryDark}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Minhas reciclagens
        </Text>
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderRecord}
        ListHeaderComponent={renderHeader()}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primaryDark}
              style={{ marginVertical: 24 }}
            />
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="recycle"
                size={42}
                color={colors.primary}
              />

              <Text style={styles.emptyTitle}>
                {error
                  ? 'Não foi possível exibir os registros'
                  : 'Nenhuma reciclagem registrada'}
              </Text>

              <Text style={styles.emptyText}>
                {error
                  ? 'Confira a mensagem acima.'
                  : 'Registre sua primeira reciclagem.'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          <Text style={styles.footer}>
            Registros demonstrativos de reciclagem.
            Não geram créditos verificados.
          </Text>
        }
      />

      {/* Confirmação de exclusão */}
      <Modal
        visible={!!recordToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!saving) setRecordToDelete(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={40}
              color="#B3261E"
            />

            <Text style={styles.modalTitle}>
              Excluir reciclagem?
            </Text>

            <Text style={styles.modalText}>
              Deseja excluir o registro de{' '}
              {recordToDelete?.quantity} unidades de{' '}
              {recordToDelete?.material}?
              Essa ação não poderá ser desfeita.
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={saving}
              accessibilityRole="button"
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.deleteButtonText}>
                  Excluir registro
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelEdit}
              onPress={() => setRecordToDelete(null)}
              disabled={saving}
              accessibilityRole="button"
            >
              <Text style={styles.cancelEditText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 16,
    gap: 12,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },

  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  summaryCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },

  summaryContent: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 12,
    color: colors.primaryLight,
  },

  summaryValue: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.white,
    marginVertical: 6,
  },

  summarySubtitle: {
    fontSize: 11,
    color: colors.primaryLight,
  },

  form: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  materialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 18,
  },

  materialButton: {
    width: '48%',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  materialSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryDark,
  },

  materialText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: colors.background,
  },

  errorText: {
    color: '#B3261E',
    backgroundColor: '#FDECEA',
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 8,
  },

  successText: {
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 8,
  },

  cancelEdit: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  cancelEditText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '600',
  },

  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  historyCount: {
    fontSize: 12,
    color: colors.textLight,
  },

  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },

  recordIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  recordInfo: {
    flex: 1,
  },

  recordTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },

  recordQuantity: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 3,
  },

  recordDate: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 3,
  },

  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.backgroundSoft,
    borderRadius: 16,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 6,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textLight,
    marginTop: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
  },

  modalText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 21,
    marginVertical: 16,
  },

  deleteButton: {
    backgroundColor: '#B3261E',
    width: '100%',
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
