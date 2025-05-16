/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { EsquemaProducto } from "@/logica/esquemas/producto";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  PRODUCTO_EXISTE: "Ya existe un producto con ese nombre.",
  CREACION_EXITOSA: "Producto creado exitosamente.",
  ERROR_CREACION: "Error al crear el producto.",
  ACTUALIZACION_EXITOSA: "Producto actualizado exitosamente.",
  ERROR_ACTUALIZACION: "Error al actualizar el producto.",
  ELIMINACION_EXITOSA: "Producto eliminado exitosamente.",
  ERROR_ELIMINACION: "Error al eliminar el producto.",
  NO_ENCONTRADO: "Producto no encontrado.",
};

type RespuestaProducto = {
  exito?: string;
  error?: string;
  datos?: any;
};

export const crearProducto = async (
  valores: z.infer<typeof EsquemaProducto>
): Promise<RespuestaProducto> => {
  const validacion = EsquemaProducto.safeParse(valores);

  if (!validacion.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const {
    nombre,
    descripcion,
    codigoBarras,
    registroInvima,
    precioCompra,
    precioVenta,
    unidadMedida,
    estado,
    categoriaId,
  } = validacion.data;

  try {
    const productoExistente = await prisma.producto.findFirst({
      where: { nombre },
    });

    if (productoExistente) {
      return { error: MENSAJES.PRODUCTO_EXISTE };
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        codigoBarras,
        registroInvima,
        precioCompra,
        precioVenta,
        unidadMedida,
        estado,
        categoriaId,
      },
    });

    return { exito: MENSAJES.CREACION_EXITOSA, datos: nuevoProducto };
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return { error: MENSAJES.ERROR_CREACION };
  }
};

export const actualizarProducto = async (
  productoId: string,
  valores: z.infer<typeof EsquemaProducto>
): Promise<RespuestaProducto> => {
  const validacion = EsquemaProducto.safeParse(valores);

  if (!validacion.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const {
    nombre,
    descripcion,
    codigoBarras,
    registroInvima,
    precioCompra,
    precioVenta,
    unidadMedida,
    estado,
    categoriaId,
  } = validacion.data;

  try {
    const productoExistente = await prisma.producto.findFirst({
      where: { nombre },
    });

    if (productoExistente && productoExistente.id !== productoId) {
      return { error: MENSAJES.PRODUCTO_EXISTE };
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: productoId },
      data: {
        nombre,
        descripcion,
        codigoBarras,
        registroInvima,
        precioCompra,
        precioVenta,
        unidadMedida,
        estado,
        categoriaId,
      },
    });

    return {
      exito: MENSAJES.ACTUALIZACION_EXITOSA,
      datos: productoActualizado,
    };
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return { error: MENSAJES.ERROR_ACTUALIZACION };
  }
};

export const eliminarProducto = async (
  productoId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await prisma.producto.delete({ where: { id: productoId } });
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return { success: false, error: MENSAJES.ERROR_ELIMINACION };
  }
};


export const obtenerProductoPorId = async (
  productoId: string
): Promise<RespuestaProducto> => {
  if (!productoId || typeof productoId !== "string") {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  try {
    const producto = await prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      return { error: MENSAJES.NO_ENCONTRADO };
    }

    return { datos: producto };
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerProductos = async (): Promise<RespuestaProducto> => {
  try {
    const productos = await prisma.producto.findMany();
    return { datos: productos };
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerProductosActivos = async (): Promise<RespuestaProducto> => {
  try {
    const productos = await prisma.producto.findMany({
      where: { estado: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precioVenta: true, // Este campo es de tipo Decimal
        categoria: {
          select: {
            nombre: true,
          },
        },
      },
    });

    // Convertimos el precioVenta de Decimal a number directamente
    const productosConCategoriaNombre = productos.map((producto) => ({
      ...producto,
      precioVenta: producto.precioVenta.toNumber(), // Convertir Decimal a number
      categoriaNombre: producto.categoria.nombre,
      categoria: undefined, // Eliminamos el objeto complejo
    }));

    return { datos: productosConCategoriaNombre };
  } catch (error) {
    console.error("Error al obtener los productos activos:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerCantidadProductosPorCategoria =
  async (): Promise<RespuestaProducto> => {
    try {
      const resultado = await prisma.producto.groupBy({
        by: ["categoriaId"],
        _count: {
          categoriaId: true,
        },
        where: {
          estado: true,
        },
      });

      const categorias = await prisma.categoria.findMany({
        where: {
          id: {
            in: resultado.map((r) => r.categoriaId),
          },
        },
      });

      const datos = resultado.map((item) => {
        const categoria = categorias.find((cat) => cat.id === item.categoriaId);
        return {
          categoria: categoria?.nombre || "Sin categoría",
          cantidad: item._count.categoriaId,
        };
      });

      return { datos };
    } catch (error) {
      console.error("Error al agrupar productos por categoría:", error);
      return { error: "No se pudo agrupar productos por categoría." };
    }
  };

export const obtenerProductosPorCategoria = async (
  categoriaId: string
): Promise<RespuestaProducto> => {
  try {
    const productos = await prisma.producto.findMany({
      where: { categoriaId },
    });

    return { datos: productos };
  } catch (error) {
    console.error("Error al obtener los productos por categoría:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};
