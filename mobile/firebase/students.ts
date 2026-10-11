import { doc, getDoc, setDoc } from 'firebase/firestore';

import { createStudent, type Student } from '../types/student';
import { firestore } from './client';

const normalizeStudentId = (studentName: string) =>
  studentName.trim().toLowerCase().replace(/\s+/g, '-');

const studentDocument = (studentName: string) =>
  doc(firestore, 'students', normalizeStudentId(studentName));

export async function saveStudentToFirestore(student: Student): Promise<Student> {
  const studentName = student.name.trim();

  if (!studentName) {
    throw new Error('Student name is required to save a student profile.');
  }

  const studentData: Student = {
    name: studentName,
    password: student.password,
    image: student.image,
    voice: student.voice,
    color: student.color,
    isConnected: student.isConnected,
  };

  await setDoc(studentDocument(studentName), studentData);

  return studentData;
}

export async function getStudentFromFirestore(studentName: string): Promise<Student | null> {
  const snapshot = await getDoc(studentDocument(studentName));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return createStudent({
    name: String(data.name ?? ''),
    password: String(data.password ?? ''),
    image: data.image ?? null,
    voice: data.voice ?? null,
    color: typeof data.color === 'string' ? data.color : '#f8fafc',
    isConnected: Boolean(data.isConnected),
  });
}
