import { customAlphabet } from 'nanoid';

const alphabet = '012356789ABCDEFGHIJKLMOPQRSTUVWXYZabcdmnopqrstuvwxyz';
export const nanoid = customAlphabet(alphabet, 7);
// nanoid() //=> "1UDtJ"