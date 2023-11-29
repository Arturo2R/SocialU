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
    userName?: string;
    phoneNumber?: number;
    description?: string;
    semester?: number;
    career: string;
  }

  interface AppConfiguration { 
    anonimoDefault: boolean;
    useUserName: boolean;
  }

  interface UserState extends User {
    configuration: AppConfiguration;
  }

  interface FormPost {
    title: string;
    message: string; // !TODO: Change property name to content
    image?: string;
    isEvent?: boolean;
    date?: Date | string;
    anonimo: boolean;
    // author: string | "anonimo"; // !TODO: Change to { image?: string; name: string; id: string } | "anonimo"
    // comments: string[]; ////Comments are not implemented yet
    // suscribed: string[];
  }
  interface Post extends FormPost {
    useUserName: boolean;
    authorEmail: string; 
    id?: string;
    createdAt: any; // !TODO: Change string to Date type
    userUID?: string;
    authorRef?: string;
    authorName?: string | null;
    suscriptions?: {
      user: { name: string; ref: `user/${string}`; image: string };
      suscribedAt: Timestamp;
    }[];
    createdAt?: Timestamp;
    authorImage: string;
    userName?: string;
  }

  interface anything {
    [field: string]: any | [];
  }
}
