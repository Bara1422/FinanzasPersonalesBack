import { compareSync, hashSync } from "bcrypt";

export class BcryptAdapter {
  private static instance: BcryptAdapter;
  private saltRounds: number = 10;
  private constructor() {}

  public static getInstance(): BcryptAdapter {
    if (!BcryptAdapter.instance) {
      BcryptAdapter.instance = new BcryptAdapter();
    }
    return BcryptAdapter.instance;
  }

  hash(password: string): string {
    return hashSync(password, this.saltRounds);
  }

  compare(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }
}
