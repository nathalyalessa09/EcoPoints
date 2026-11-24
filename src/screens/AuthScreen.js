
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// Serviço de autenticação do Firebase
import {
  registerUser,
  loginUser,
  getAuthErrorMessage,
} from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthScreen() {
  // Controla o modo de login ou cadastro
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validação dos campos do formulário
  function validate() {
    const newErrors = {};

    if (isRegister && name.trim().length < 3) {
      newErrors.name = 'Informe seu nome completo';
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Informe um e-mail válido';
    }

    if (password.length < 6) {
      newErrors.password =
        'A senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // Autenticação real com Firebase
  async function handleSubmit() {
    if (loading || !validate()) return;

    setLoading(true);

    try {
      if (isRegister) {
        // Cadastro de um novo usuário
        await registerUser(name, email, password);
      } else {
        // Login de um usuário existente
        await loginUser(email, password);
      }

      // A navegação é controlada pelo AuthContext
      // e pelo AppNavigator.

    } catch (error) {
      setErrors({
        general: getAuthErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }

  // Alterna entre login e cadastro
  function handleSwitchMode() {
    if (loading) return;

    setErrors({});
    setPassword('');
    setIsRegister((prev) => !prev);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="sprout"
              size={40}
              color={colors.primaryDark}
            />
          </View>

          <Text style={styles.title}>
            Eco<Text style={styles.titleAccent}>Points</Text>
          </Text>

          <Text style={styles.subtitle}>
            Recicle, acumule pontos e troque por benefícios reais
          </Text>
        </View>

        <View style={styles.form}>
          {isRegister && (
            <CustomInput
              label="Nome completo"
              placeholder="Como podemos te chamar?"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
              editable={!loading}
            />
          )}

          <CustomInput
            label="E-mail"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <CustomInput
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          {/* Mensagem de erro retornada pelo Firebase */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={20}
                color="#B3261E"
              />

              <Text
                style={styles.generalError}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                {errors.general}
              </Text>
            </View>
          )}

          <CustomButton
            title={isRegister ? 'Criar conta' : 'Entrar'}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: 8 }}
          />

          <TouchableOpacity
            style={styles.switchMode}
            onPress={handleSwitchMode}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={
              isRegister
                ? 'Entrar em uma conta existente'
                : 'Criar uma nova conta'
            }
            accessibilityState={{ disabled: loading }}
          >
            <Text style={styles.switchModeText}>
              {isRegister
                ? 'Já tem uma conta? '
                : 'Ainda não tem conta? '}

              <Text style={styles.switchModeAction}>
                {isRegister ? 'Entrar' : 'Cadastre-se'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: 36,
  },

  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.accent,
  },

  titleAccent: {
    color: colors.primary,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  form: {
    backgroundColor: colors.white + 'CC',
    borderRadius: 24,
    padding: 20,
  },

  switchMode: {
    marginTop: 8,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  switchModeText: {
    fontSize: 13,
    color: colors.textLight,
  },

  switchModeAction: {
    color: colors.primaryDark,
    fontWeight: '700',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },

  generalError: {
    flex: 1,
    color: '#B3261E',
    fontSize: 13,
    lineHeight: 19,
  },
});
