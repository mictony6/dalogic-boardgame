export class Operations {
  constructor() {
  }

  static and(a,b){
    return a & b;
  }

  static or(a,b){
    return a | b;
  }

  static xor(a,b){
    return a ^ b;
  }

  static not(a) {
    return Operations.truncateBits(~a, 2);
  }

  // Function to cut off extra bits and keep only a specified number of bits
  static truncateBits(number, numBits) {
    // Create a bitmask with the desired number of bits
    let bitmask = (1 << numBits) - 1;

    // Perform bitwise AND operation to retain only the specified number of bits
    return number & bitmask;
  }

  static nand(a,b){
    return this.not(this.and(a,b));
  }

  static nor(a,b){
    return this.not(this.or(a,b));
  }

  static get operations(){
    return ['AND', 'OR', 'XOR', 'NAND'];
  }


}

