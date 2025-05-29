import { z } from "zod";

/**
 * EsquemaProducto define la estructura de validación para un producto.
 * Se usa Zod para asegurar la integridad de los datos.
 */
export const EsquemaProducto = z.object({
  /**
   * ID único del producto.
   * Opcional, puede ser asignado automáticamente por la base de datos.
   */
  id: z.string().optional(),

  /**
   * Nombre del producto.
   * Campo obligatorio con al menos un carácter.
   */
  nombre: z.string().min(1, { message: "El nombre del producto es requerido" }),

  /**
   * Descripción del producto.
   * Campo opcional.
   */
  descripcion: z.string().optional(),

  /**
   * Código de barras del producto.
   * Campo opcional.
   */
  codigoBarras: z.string().optional(),

  /**
   * Nombre de la categoría a la que pertenece el producto.
   * Campo opcional, se usa cuando se desea mostrar el nombre en vez del ID.
   */
  categoriaNombre: z.string().optional(),

  /**
   * Número de registro INVIMA del producto (relevante en productos regulados en Colombia).
   * Campo opcional.
   */
  registroInvima: z.string().optional(),

  /**
   * Precio de compra del producto.
   * Campo obligatorio, debe ser un número positivo.
   */
  precioCompra: z.coerce
    .number()
    .positive({ message: "Debe ser un número positivo" }),

  /**
   * Precio de venta del producto.
   * Campo obligatorio, debe ser un número positivo.
   */
  precioVenta: z.coerce
    .number()
    .positive({ message: "Debe ser un número positivo" }),

  /**
   * Unidad de medida del producto (ej. kg, litro, unidad).
   * Campo obligatorio con al menos un carácter.
   */
  unidadMedida: z
    .string()
    .min(1, { message: "La unidad de medida es requerida" }),

  /**
   * Estado del producto (activo o inactivo).
   * Campo obligatorio con valor por defecto en `true`.
   */
  estado: z.coerce
    .boolean({ invalid_type_error: "Debe seleccionar si está activo o no" })
    .default(true),

  /**
   * Fecha en que se creó el producto.
   * Campo opcional.
   */
  creadoEn: z.date().optional(),

  /**
   * Fecha de última actualización del producto.
   * Campo opcional.
   */
  actualizadoEn: z.date().optional(),

  /**
   * ID de la categoría a la que pertenece el producto.
   * Campo obligatorio.
   */
  categoriaId: z.string().min(1, { message: "La categoría es requerida" }),
});

/**
 * Tipo inferido de Producto basado en el esquema EsquemaProducto.
 * Se utiliza para tener tipado fuerte en TypeScript.
 */
export type Producto = z.infer<typeof EsquemaProducto>;
