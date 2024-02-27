import App from "../pages/_app";
import { Timestamp } from "@firebase/firestore";

export { };

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
    phoneNumber?: number | "";
    description?: string;
    semester?: number | "";
    career: string;
  }

  interface AppConfiguration {
    anonimoDefault: boolean;
    useUserName: boolean;
  }

  type UserState = User & AppConfiguration


  interface FormPost {
    title?: string;
    message: string; // !TODO: Change property name to content
    image?: string;
    isEvent?: boolean;
    date?: Date | null;
    tags?: string[];
    time?: string;
    anonimo: boolean;
    // author: string | "anonimo"; // !TODO: Change to { image?: string; name: string; id: string } | "anonimo"
    // comments: string[]; ////Comments are not implemented yet
    // suscribed: string[];
  }

  type imageData = {
    width: number;
    height: number;
  }

  interface ComputedPost extends FormPost {
    imageData?: imageData;
    computedDate?: Date;
  }

  interface PostCardProps {
    author:
    | { image?: string | null; name: string; id: string }
    | "anonimo";
    priority?: boolean;
    tags?: string[];
    imageData?: imageData;
    image?: string;
    description: string;
    title?: string;
    date?: Date;
    event?: boolean;
    postId?: string;
    createdAt?: Timestamp;
    // relevantCommentary?: Object;
    asistants?: suscription[];
    commentsQuantity?: number;
    // key: number;
    userUID?: string;
    subscribeToPost: (postId: string, remove: boolean) => void;
  }

  type suscription = {
    user: {
      image: string;
      name: string;
      ref: `user/${string}`;
      userName: string;
    };
    suscribedAt?: Timestamp;
  }

  interface Post extends ComputedPost {
    useUserName: boolean;
    authorEmail: string;
    id?: string;
    createdAt: any; // !TODO: Change string to Date type
    userUID?: string;
    authorRef?: string;
    authorName?: string | null;
    suscriptions?: suscription[];
    createdAt?: Timestamp;
    authorImage: string;
    userName?: string;
    commentsQuantity?: number;
  }


  interface googleResponse {
    credential: string;
    clientId: string;
    select_by: string;
  }

  interface googleDecodedResponse {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    sub: string;
    given_name: string;
    family_name: string;
    locale: string;
  }

  interface Login {
    email: string;
    password: string;
  }

  interface AuthContextInterface {
    // signup(email: string, password: string): Promise<UserCredential>;
    // login(email: string, password: string): Promise<UserCredential>;
    suscribetoPost(postId: string, remove: boolean): Promise<void>;
    user: UserState | null;
    setUser: Function
    logout(): void;
    // valid: boolean|string;
    loading: boolean;
    // loginWithGoogle():? Promise<UserCredential>;
    loginWithMicrosoft(): Promise<UserCredential>;
    // resetPassword(email: string): Promise<void>;
    // loginWithGoogleOneTap(response: googleResponse): Promise<UserCredential>;
  }



  interface University {
    name: string;
    domain: string;
  }
  interface superUser {
    email: string;
    uid: string;
    displayName?: string;
    photoURL?: string;
    username?: string;
    phoneNumber?: number;
    university: University;
    description?: string;
    carrer?: string;
  }

  type CategoryState = { color: string, name: string, value: string, variant: string }

  interface anything {
    [field: string]: any | [];
  }
}
