export interface IUserRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  findByEmail(email: string): Promise<T | null>;
  findByUsername(username: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<string>;
  validateCredentials(email: string, password: string): Promise<T | null>;
  findByResetToken(token: string): Promise<T | null>;
  setResetToken(
    id: number,
    token: string | null,
    expiresAt: Date | null,
  ): Promise<T | null>;
  updatePassword(id: number, password: string): Promise<T | null>;
}
