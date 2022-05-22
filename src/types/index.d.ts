export {};

declare global {
  interface Window {
    google: any;
  }

  interface User {
    email?: string;
    uid?: string;
    displayName?: string;
    photoURL?: string;
    username?: string;
    phoneNumber?: number;
    description?: string;
  }

  interface FormPost {
    title: string;
    message: string; // !TODO: Change property name to content
    image?: string;
    isEvent?: boolean;
    date: string;
    anonimo: boolean;
    // author: string | "anonimo"; // !TODO: Change to { image?: string; name: string; id: string } | "anonimo"
    // comments: string[]; ////Comments are not implemented yet
    // suscribed: string[];
  }
  interface Post extends FormPost {
    id?: string;
    createdAt: any; // !TODO: Change string to Date type
    userUID?: string;
    authorRef?: string;
    authorName?: string | null;
    suscriptions?: {
      user: { name: string; ref: `user/${string}`; image: string };
      suscribedAt: Timestamp;
    }[];
  }

  interface anything {
    [field: string]: any | [];
  }
}
