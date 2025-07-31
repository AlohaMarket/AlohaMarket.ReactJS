export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  message: string;
  data?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total_pages: number;
    total_items: number;
    current_page: number;
    page_size: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  data?: unknown;
  validationErrors?: {
    field: string;
    message: string;
  }[];
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
}

// UI types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

// Language types
export type Language = 'en' | 'vi';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}