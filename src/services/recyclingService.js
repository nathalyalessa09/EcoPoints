
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { db, auth } from '../config/firebase';

const COLLECTION_NAME = 'recyclingRecords';

function getCurrentUserId() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Usuário não autenticado.');
  }

  return user.uid;
}

function validateRecord(material, quantity) {
  const cleanMaterial = String(material ?? '').trim();
  const parsedQuantity = Number(quantity);

  if (!cleanMaterial || cleanMaterial.length > 50) {
    throw new Error('Informe um material válido.');
  }

  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1 ||
    parsedQuantity > 1000
  ) {
    throw new Error(
      'Informe uma quantidade inteira entre 1 e 1000.'
    );
  }

  return {
    material: cleanMaterial,
    quantity: parsedQuantity,
  };
}

export async function createRecyclingRecord(material, quantity) {
  const userId = getCurrentUserId();

  const validatedData = validateRecord(material, quantity);

  const documentRef = await addDoc(
    collection(db, COLLECTION_NAME),
    {
      userId,
      ...validatedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return documentRef.id;
}

export function subscribeToRecyclingRecords(
  onData,
  onError
) {
  const userId = getCurrentUserId();

  const recordsQuery = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  return onSnapshot(
    recordsQuery,
    (snapshot) => {
      const records = snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
      }));

      records.sort((a, b) => {
        const dateA = a.createdAt?.toMillis() ?? 0;
        const dateB = b.createdAt?.toMillis() ?? 0;

        return dateB - dateA;
      });

      onData(records);
    },
    onError
  );
}

export async function updateRecyclingRecord(
  recordId,
  material,
  quantity
) {
  getCurrentUserId();

  const validatedData = validateRecord(material, quantity);

  const documentRef = doc(
    db,
    COLLECTION_NAME,
    recordId
  );

  await updateDoc(documentRef, {
    ...validatedData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRecyclingRecord(recordId) {
  getCurrentUserId();

  const documentRef = doc(
    db,
    COLLECTION_NAME,
    recordId
  );

  await deleteDoc(documentRef);
}

export function calculateTotalItems(records) {
  return records.reduce(
    (total, record) => total + record.quantity,
    0
  );
}

export function getRecyclingErrorMessage(error) {
  switch (error.code) {
    case 'permission-denied':
      return 'Você não tem permissão para realizar esta operação.';

    case 'unavailable':
      return 'Serviço indisponível. Verifique sua conexão.';

    case 'not-found':
      return 'Registro não encontrado.';

    case 'unauthenticated':
      return 'Entre novamente na sua conta.';

    default:
      return error.code
        ? 'Não foi possível realizar a operação. Tente novamente.'
        : error.message || 'Ocorreu um erro inesperado.';
  }
}
