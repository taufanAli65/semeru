export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  nim: string;
  nomor_whatsapp: string;
  program_studi: string;
  fakultas: string;
  semester: string;
  universitas: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export interface UseAuthReturn {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}