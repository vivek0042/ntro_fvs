import { ec as EC } from 'elliptic';
import forge from 'node-forge';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';


// Use 'p256' for NIST P-256 curve
const ECInstance = new EC('curve25519');

const DevicePriKeyPem = `MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgDB3NUBaPaDF9fn2mzIgYB5v3XOIhyi6mwoDmJBb7AhahRANCAASHho/RP1nLXcMT/3x3iMqh/0Ojf6Y34sanshpRUKovqlqGRg91wgMpTct7uu07Vxpj6RIZoBrHqiiF3FPkl6Tr`;

const HostPubKeyPem = `-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExVFK/egmSDFuvRIkJdfoguYGvzMd
/djcYFtBe43J5TkT17PGiWNpwWL0wZ9aGzClZ4pStpHZ0e8iemFxOB6pgg==`;


// Convert PEM to DER
// function pemToDer(pem) {
//     return forge.util.decode64(pem.replace(/-----BEGIN (.*)-----|-----END (.*)-----|\s+/g, ''));
// }

// // Get private key from DER
// function getPrivateKeyFrom(der) {
//     const privateKeyHex = forge.util.bytesToHex(der);
//     const privateKey = ECInstance.keyFromPrivate(privateKeyHex, 'hex');
//     return privateKey;
// }

// // Get public key from DER
// function getPublicKeyFrom(der) {
//     const PublicKeyHex = forge.util.bytesToHex(der);
//     const PublicKey = ECInstance.keyFromPrivate(PublicKeyHex, 'hex');
//     return PublicKey;
// }

// Generate Shared Secret Key (SSK)
// function generateSsk() {
//     try {
//         const privateKeyDer = pemToDer(DevicePriKeyPem);
//         const publicKeyDer = pemToDer(HostPubKeyPem);
//         const privateKey = getPrivateKeyFrom(privateKeyDer);
//         const publicKey = getPublicKeyFrom(publicKeyDer);
//         const sharedSecret = privateKey.derive(publicKey.getPublic()).toString('hex');
//         const sharedSecretBytes = Buffer.from(sharedSecret, 'hex');
//         return sharedSecretBytes;
//     } catch (error) {
//         console.error('Error while generating SSK:', error.message);
//         return null;
//     }
// }
function generateSsk() {
    try {
        // const privateKeyDer = pemToDer(DevicePriKeyPem);
        // const publicKeyDer = pemToDer(HostPubKeyPem);
        // const privateKey = getPrivateKeyFrom(DevicePriKeyPem);
        // const publicKey = getPublicKeyFrom(HostPubKeyPem);
        // const sharedSecret = privateKey.derive(publicKey.getPublic()).toString('hex');
        // const sharedSecretBytes = Buffer.from(sharedSecret, 'hex');
        const sharedSecretBytes=getSharedSecretValue(DevicePriKeyPem,HostPubKeyPem)
        return sharedSecretBytes;
    } catch (error) {
        console.error('Error while generating SSK:', error.message);
        return null;
    }
}

const getSharedSecretValue = (privKeyBase64, pubKeyBase64) => {
    const privateKey = getPrivateKeyFrom(privKeyBase64);
    const publicKey = getPublicKeyFrom(pubKeyBase64);
  
    // Generate shared secret
    const sharedSecret = privateKey.deriveSharedSecret(publicKey);
    return sharedSecret;
  };
    // Function to get private key from Base64 string
    const getPrivateKeyFrom = (privateKeyBase64) => {
        const privateKeyBytes = getByteFromBase64(privateKeyBase64);
        const privateKeyDer = forge.util.createBuffer(privateKeyBytes);
        const privateKeyAsn1 = forge.asn1.fromDer(privateKeyDer);
        const privateKey = forge.pki.privateKeyFromAsn1(privateKeyAsn1);
        return privateKey;
      };
      
      // Function to get public key from Base64 string
      const getPublicKeyFrom = (publicKeyBase64) => {
        const publicKeyBytes = getByteFromBase64(publicKeyBase64);
        const publicKeyDer = forge.util.createBuffer(publicKeyBytes);
        const publicKeyAsn1 = forge.asn1.fromDer(publicKeyDer);
        const publicKey = forge.pki.publicKeyFromAsn1(publicKeyAsn1);
        return publicKey;
      };
    
    
  const getByteFromBase64 = (base64String) => {
    // Decode Base64 string to WordArray
    const wordArray = CryptoJS.enc.Base64.parse(base64String);
  
    // Convert WordArray to byte array
    const byteArray = new Uint8Array(wordArray.words.length * 4);
    for (let i = 0; i < wordArray.words.length; i++) {
      const word = wordArray.words[i];
      byteArray[i * 4] = (word >> 24) & 0xFF;
      byteArray[i * 4 + 1] = (word >> 16) & 0xFF;
      byteArray[i * 4 + 2] = (word >> 8) & 0xFF;
      byteArray[i * 4 + 3] = word & 0xFF;
    }
  
    return byteArray.subarray(0, wordArray.sigBytes);
  };


// Encrypt data using AES
// function encrypt(plainText, key, iv) {
//     const keyHex = CryptoJS.enc.Hex.parse(key.toString('hex'));
//     const ivHex = CryptoJS.enc.Hex.parse(iv.toString('hex'));
//     const encrypted = CryptoJS.AES.encrypt(plainText, keyHex, { iv: ivHex });
//     return CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
// }

// function encrypt(plainText, key, iv) {
//     const keyHex = CryptoJS.enc.Hex.parse(key.toString('hex'));
//     const ivHex = CryptoJS.enc.Hex.parse(iv.toString('hex'));
//     const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), keyHex, { iv: ivHex });
//     return Buffer.from(encrypted.ciphertext.toString(CryptoJS.enc.Hex), 'hex');
// }
// Encrypt function equivalent to your C# implementation
const encrypt = (plainText, key, iv) => {
    try {
      // Convert the key and IV to WordArray format
      const keyWordArray = CryptoJS.lib.WordArray.create(key);
      const ivWordArray = CryptoJS.lib.WordArray.create(iv);
  
      // Perform AES encryption
      const encrypted = CryptoJS.AES.encrypt(plainText, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
  
      // Convert the encrypted data to a hex string
      return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    } catch (error) {
      console.error('Error during encryption:', error.message);
      return null;
    }
  };
// function encrypt(plainText, key, iv) {
//     // Convert key and IV to WordArray format
//     const keyWordArray = CryptoJS.lib.WordArray.create(key);
//     const ivWordArray = CryptoJS.lib.WordArray.create(iv);
  
//     // Encrypt the data
//     const encrypted = CryptoJS.AES.encrypt(plainText, keyWordArray, {
//       iv: ivWordArray,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7
//     });
  
//     // Convert the encrypted data to a hex string
//     const hexString = encrypted.toString();
  
//     // Remove the 'ciphertext' prefix
//     const output = hexString.substring(10);
  
//     return output;
//   }
  
// Encrypt data and return result
export async function encData(plainData) {
    
    const iv = new Uint8Array(16).fill(0);

    const bytesSSK = generateSsk();
    // const bytesSSK =[
    //     71, 106, 180, 194, 63, 37, 43, 230, 8, 215, 2, 108, 51, 35, 131, 139,
    //     73, 84, 40, 94, 239, 114, 11, 192, 173, 126, 69, 180, 2, 60, 185, 48
    //   ]
    if (!bytesSSK) {
        throw new Error('Error while generating SSK');
    }

    // const sskHex = bytesSSK.toString('hex').padStart(64, '0');
    const encryptedData = encrypt(plainData, bytesSSK, iv);
    return { encryptedData, iv };
}
function byteArrayToHexString(byteArray) {
    return Array.from(byteArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}


// CheckPin function example
export const CheckPin = async (data) => {
    try {
        console.log("CheckPin API Request for checkpin -:", data.adid);
        const jsonPayload = JSON.stringify(data);
     
        // const { encryptedData } = await encData(jsonPayload);

        // console.log("CheckPin API Request for checkpin encData -:", encryptedData);

        // const response = JSON.stringify(encryptedData);
        const { encryptedData, iv } = await encData(jsonPayload);

        const hexString = byteArrayToHexString(encryptedData);

        console.log("CheckPin API Request for checkpin encData -:", hexString);

        const response = JSON.stringify({ encryptedData: hexString, iv });
        return response;
    } catch (error) {
        console.error('Error while Pin:', error.message);
        throw error;
    }
};
