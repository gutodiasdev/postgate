import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);
export const generateNanoID = () => {
  return nanoid();
}