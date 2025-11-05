import {
  categoryRepository,
  transactionRepository,
  userRepository,
} from "../repositories";
import { AuthService } from "./auth.service";
import { CategoryService } from "./category.service";
import { TransaccionService } from "./transaccion.service";
import { UserService } from "./usuario.service";

export const userService = new UserService(userRepository);
export const authService = new AuthService(userRepository);
export const categoryService = new CategoryService(categoryRepository);
export const transaccionService = new TransaccionService(transactionRepository);
