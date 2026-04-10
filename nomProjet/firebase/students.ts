import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import type { StudentState } from '../store/studentSlice';
import { firestore } from './client';

export type StudentRecord = {
  name: string;
  image: string | null;
  voice: string | null;
  color: string;
  isConnected: boolean;
  updatedAt?: unknown;
};

const normalizeStudentId = (studentName: string) =>
  studentName.trim().toLowerCase().replace(/\s+/g, '-');

const studentDocument = (studentName: string) =>
  doc(firestore, 'students', normalizeStudentId(studentName));

export async function saveStudentToFirestore(student: StudentState) {
  const studentName = student.name.trim();

  if (!studentName) {
    throw new Error('Student name is required to save a student profile.');
  }

  const record: StudentRecord = {
    name: studentName,
    image: student.image,
    voice: student.voice,
    color: student.color,
    isConnected: student.isConnected,
  };

  await setDoc(
    studentDocument(studentName),
    {
      ...record,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return record;
}

export async function getStudentFromFirestore(studentName: string) {
  const snapshot = await getDoc(studentDocument(studentName));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as StudentRecord;
}
