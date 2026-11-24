
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../config/firebase';

// Cadastro de um novo usuário
export async function registerUser(name, email, password) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await updateProfile(credential.user, {
    displayName: name.trim(),
  });

  return credential.user;
}

// Login de um usuário existente
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return credential.user;
}

// Encerramento da sessão
export async function logoutUser() {
  await signOut(auth);
}

// Tradução dos erros do Firebase
export function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';

    case 'auth/invalid-email':
      return 'Informe um e-mail válido.';

    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';

    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'E-mail ou senha incorretos.';

    case 'auth/network-request-failed':
      return 'Verifique sua conexão com a internet.';

    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';

    case 'auth/user-disabled':
      return 'Esta conta está desativada.';

    default:
      return 'Não foi possível autenticar. Tente novamente.';
  }
}
