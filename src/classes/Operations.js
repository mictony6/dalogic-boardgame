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

  static not(a){
    if (a === 0) return 1;
    else return 0;
  }

  static nand(a,b){
    return this.not(this.and(a,b));
  }

  static nor(a,b){
    return this.not(this.or(a,b));
  }


}