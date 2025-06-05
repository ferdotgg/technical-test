import { z } from "zod";

export const newProductSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  price: z
    .number({
      invalid_type_error: "El precio debe ser un número",
      required_error: "El precio es requerido",
    })
    .positive("El precio debe ser mayor que 0")
    .min(0.01, "El precio mínimo es 0.01")
    .max(10000, "El precio máximo es 10000"),
  category: z.string().optional(),
});

export type NewProductFormValues = z.infer<typeof newProductSchema>;
