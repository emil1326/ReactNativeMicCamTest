export type Student = {
  name: string;
  password: string;
  image: string | null;
  voice: string | null;
  color: string;
  isConnected: boolean;
};

const defaultStudent: Student = {
  name: '',
  password: '',
  image: null,
  voice: null,
  color: '#f8fafc',
  isConnected: false,
};

export function createStudent(overrides: Partial<Student> = {}): Student {
  return {
    ...defaultStudent,
    ...overrides,
  };
}
