import { compareSync, hashSync } from "bcrypt";

export class BcryptAdapter {
  constructor(private readonly saltRounds: number = 10) {}

  hash(password: string): string {
    return hashSync(password, this.saltRounds);
  }

  compare(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }
}
