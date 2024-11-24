import { Mnemonic } from '@multiversx/sdk-wallet';

export const generatePemContent = async (seedPhrase: string): Promise<string> => {
  try {
    if (!seedPhrase) {
      throw new Error('You have to provide the seed phrase value!');
    }

    const mnemonic = Mnemonic.fromString(seedPhrase);
    const buff = mnemonic.deriveKey();

    const secretKeyHex = buff.hex();
    const pubKeyHex = buff.generatePublicKey().hex();

    const combinedKeys = Buffer.from(secretKeyHex + pubKeyHex).toString('base64');

    const header = '-----BEGIN PRIVATE KEY-----';
    const footer = '-----END PRIVATE KEY-----';

    const content = `${header}\n${combinedKeys.replace(/([^\n]{1,64})/g, '$1\n')}${footer}`;

    return content;
  } catch (e: any) {
    throw new Error(e.message);
  }
};