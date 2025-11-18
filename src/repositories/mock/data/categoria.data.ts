import { $Enums, type Categoria } from "@prisma/client";

export const categoriasMock: Categoria[] = [
  { id_categoria: 1, nombre: "Alimentos", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 2, nombre: "Transporte", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 3, nombre: "Vivienda", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 4, nombre: "Salud", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 5, nombre: "Educación", tipo: $Enums.TipoCategoria.GASTO },
  {
    id_categoria: 6,
    nombre: "Entretenimiento",
    tipo: $Enums.TipoCategoria.GASTO,
  },
  { id_categoria: 7, nombre: "Ropa", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 8, nombre: "Tecnología", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 9, nombre: "Viajes", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 10, nombre: "Otros", tipo: $Enums.TipoCategoria.GASTO },
  { id_categoria: 11, nombre: "Salario", tipo: $Enums.TipoCategoria.INGRESO },
  { id_categoria: 12, nombre: "Ventas", tipo: $Enums.TipoCategoria.INGRESO },
  { id_categoria: 13, nombre: "Regalos", tipo: $Enums.TipoCategoria.INGRESO },
  {
    id_categoria: 14,
    nombre: "Inversiones",
    tipo: $Enums.TipoCategoria.INGRESO,
  },
  {
    id_categoria: 15,
    nombre: "Otros Ingresos",
    tipo: $Enums.TipoCategoria.INGRESO,
  },
];
