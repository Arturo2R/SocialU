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
}
