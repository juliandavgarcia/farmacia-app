/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { EsquemaProveedor } from "../esquemas/proveedor";

const prisma = new PrismaClient();

type MensajeRespuesta = {
  success?: string;
  error?: string;
  data?: any;
};

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  PROVEEDOR_EXISTE: "Ya existe un proveedor con ese NIT.",
  CREACION_EXITOSA: "Proveedor creado exitosamente.",
  ERROR_CREACION: "Error al crear el proveedor.",
  ACTUALIZACION_EXITOSA: "Proveedor actualizado exitosamente.",
  ERROR_ACTUALIZACION: "Error al actualizar el proveedor.",
  ELIMINACION_EXITOSA: "Proveedor eliminado exitosamente.",
  ERROR_ELIMINACION: "Error al eliminar el proveedor.",
  NO_ENCONTRADO: "Proveedor no encontrado.",
  VIOLACION_RESTRICCION: "No se puede eliminar porque hay registros asociados.",
};

export const crearProveedor = async (
  valores: z.infer<typeof EsquemaProveedor>
): Promise<MensajeRespuesta> => {
  const camposValidados = EsquemaProveedor.safeParse(valores);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { nit, ...datos } = camposValidados.data;

  try {
    const proveedorExistente = await prisma.proveedor.findUnique({
      where: { nit },
    });

    if (proveedorExistente) {
      return { error: MENSAJES.PROVEEDOR_EXISTE };
    }

    const nuevoProveedor = await prisma.proveedor.create({
      data: { ...datos, nit },
    });

    return { success: MENSAJES.CREACION_EXITOSA, data: nuevoProveedor };
  } catch (error) {
    console.error("Error al crear el proveedor:", error);
    return { error: MENSAJES.ERROR_CREACION };
  }
};

export const actualizarProveedor = async (
  proveedorId: string,
  valores: z.infer<typeof EsquemaProveedor>
): Promise<MensajeRespuesta> => {
  const camposValidados = EsquemaProveedor.safeParse(valores);

  if (!camposValidados.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { nit, ...datos } = camposValidados.data;

  try {
    const proveedorExistente = await prisma.proveedor.findUnique({
      where: { nit },
    });

    if (proveedorExistente && proveedorExistente.id !== proveedorId) {
      return { error: MENSAJES.PROVEEDOR_EXISTE };
    }

    const proveedorActualizado = await prisma.proveedor.update({
      where: { id: proveedorId },
      data: {
        nit,
        ...datos,
      },
    });

    return {
      success: MENSAJES.ACTUALIZACION_EXITOSA,
      data: proveedorActualizado,
    };
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    return { error: MENSAJES.ERROR_ACTUALIZACION };
  }
};

export const eliminarProveedor = async (
  proveedorId: string
): Promise<{ exito: boolean; error?: string }> => {
  try {
    await prisma.proveedor.delete({ where: { id: proveedorId } });
    return { exito: true };
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const errorPrisma = error as { code: string };
      if (errorPrisma.code === "P2003") {
        return { exito: false, error: MENSAJES.VIOLACION_RESTRICCION };
      }
    }

    return { exito: false, error: MENSAJES.ERROR_ELIMINACION };
  }
};

export const obtenerProveedorPorId = async (
  proveedorId: string
): Promise<MensajeRespuesta> => {
  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: proveedorId },
    });
    if (!proveedor) {
      return { error: MENSAJES.NO_ENCONTRADO };
    }
    return { data: proveedor };
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerProveedores = async (): Promise<MensajeRespuesta> => {
  try {
    const proveedores = await prisma.proveedor.findMany();
    return { data: proveedores };
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerCantidadProveedores =
  async (): Promise<MensajeRespuesta> => {
    try {
      const cantidad = await prisma.proveedor.count();
      return { data: cantidad };
    } catch (error) {
      console.error("Error al obtener la cantidad de proveedores:", error);
      return { error: "Error al obtener la cantidad de proveedores." };
    }
  };

export const obtenerProveedoresHoy = async (): Promise<MensajeRespuesta> => {
  const hoy = new Date();
  const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));

  try {
    const cantidadHoy = await prisma.proveedor.count({
      where: {
        creadoEn: {
          gte: inicioDia,
        },
      },
    });
    return { data: cantidadHoy };
  } catch (error) {
    console.error("Error al obtener los proveedores de hoy:", error);
    return {
      error: "Error al obtener los proveedores de hoy.",
    };
  }
};

export const obtenerProveedoresSemana = async (): Promise<MensajeRespuesta> => {
  const hoy = new Date();
  const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));

  try {
    const cantidadSemana = await prisma.proveedor.count({
      where: {
        creadoEn: {
          gte: inicioSemana,
        },
      },
    });
    return { data: cantidadSemana };
  } catch (error) {
    console.error("Error al obtener los proveedores de la semana:", error);
    return {
      error: "Error al obtener los proveedores de la semana.",
    };
  }
};

export const obtenerProveedoresMes = async (): Promise<MensajeRespuesta> => {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  try {
    const cantidadMes = await prisma.proveedor.count({
      where: {
        creadoEn: {
          gte: inicioMes,
        },
      },
    });
    return { data: cantidadMes };
  } catch (error) {
    console.error("Error al obtener los proveedores del mes:", error);
    return {
      error: "Error al obtener los proveedores del mes.",
    };
  }
};
