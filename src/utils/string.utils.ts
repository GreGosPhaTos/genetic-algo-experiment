export function stringToBinary(str: string) {
  const utf8Encoder = new TextEncoder(); // Crée un encodeur UTF-8
  const byteArray = utf8Encoder.encode(str); // Encode la chaîne en tableau d’octets

  // Convertit chaque octet en une chaîne binaire de 8 bits
  const binaryArray = Array.from(byteArray, (byte) => {
    return byte.toString(2).padStart(8, '0');
  });

  // Concatène les bits sous forme d'une seule chaîne
  return binaryArray.join('');
}

export function binaryStringToUTF8String(binary: string) {
  if (binary.length % 2) {
    throw new Error('Invalid binary size must a multiple of 2');
  }

  let byteArray: string[] = [];
  for (let i = 0; i < binary.length; i += 8) {
    const slice = binary.slice(i, i + 8);
    if (slice.length) {
      byteArray.push(slice.toString());
    }
  }

  // Decode the byte array into a UTF-8 string
  const utf8Decoder = new TextDecoder();
  return utf8Decoder.decode(
    new Uint8Array(byteArray.map((byte) => parseInt(byte, 2)))
  );
}

// The lower the score is the better
export function compareBinaryString(binary1: string, binary2: string) {
  let score = 0;
  // let strTest = '';
  Array.from(binary1).forEach((v, i) => {
    score += Number(v) ^ Number(binary2[i]) ? 0 : 1;
    // strTest += `${Number(v) ^ Number(binary2[i])}`;
  });

  return score;
}

export function randomString(len: number) {
  return new Array(len)
    .fill('0')
    .map(() => Math.floor(Math.random() * 10) % 2)
    .join('');
}
