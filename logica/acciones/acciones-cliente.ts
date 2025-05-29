/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { EsquemaCliente } from "@/logica/esquemas/cliente";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const MENSAJES = {
  CAMPOS_INVALIDOS: "¡Campos no válidos!",
  CLIENTE_EXISTE: "Ya existe un cliente con ese documento.",
  CREACION_EXITOSA: "Cliente creado exitosamente.",
  ERROR_CREACION: "Error al crear el cliente.",
  ACTUALIZACION_EXITOSA: "Cliente actualizado exitosamente.",
  ERROR_ACTUALIZACION: "Error al actualizar el cliente.",
  ELIMINACION_EXITOSA: "Cliente eliminado exitosamente.",
  ERROR_ELIMINACION: "Error al eliminar el cliente.",
  NO_ENCONTRADO: "Cliente no encontrado.",
};

type RespuestaCliente = {
  exito?: string;
  error?: string;
  datos?: any;
};

export const crearCliente = async (
  valores: z.infer<typeof EsquemaCliente>
): Promise<RespuestaCliente> => {
  const validacion = EsquemaCliente.safeParse(valores);

  if (!validacion.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { documento, nombre, telefono, direccion, correo } = validacion.data;

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { documento },
    });

    if (clienteExistente) {
      return { error: MENSAJES.CLIENTE_EXISTE };
    }

    const nuevoCliente = await prisma.cliente.create({
      data: {
        documento,
        nombre,
        telefono,
        direccion,
        correo,
      },
    });

    return { exito: MENSAJES.CREACION_EXITOSA, datos: nuevoCliente };
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return { error: MENSAJES.ERROR_CREACION };
  }
};

export const actualizarCliente = async (
  clienteId: string,
  valores: z.infer<typeof EsquemaCliente>
): Promise<RespuestaCliente> => {
  const validacion = EsquemaCliente.safeParse(valores);

  if (!validacion.success) {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  const { documento, nombre, telefono, direccion, correo } = validacion.data;

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { documento },
    });

    if (clienteExistente && clienteExistente.id !== clienteId) {
      return { error: MENSAJES.CLIENTE_EXISTE };
    }

    const clienteActualizado = await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        documento,
        nombre,
        telefono,
        direccion,
        correo,
      },
    });

    return {
      exito: MENSAJES.ACTUALIZACION_EXITOSA,
      datos: clienteActualizado,
    };
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    return { error: MENSAJES.ERROR_ACTUALIZACION };
  }
};

export const eliminarCliente = async (
  clienteId: string
): Promise<{ exito: boolean; error?: string }> => {
  try {
    await prisma.cliente.delete({ where: { id: clienteId } });
    return { exito: true };
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return { exito: false, error: MENSAJES.ERROR_ELIMINACION };
  }
};

export const obtenerClientePorId = async (
  clienteId: string
): Promise<RespuestaCliente> => {
  if (!clienteId || typeof clienteId !== "string") {
    return { error: MENSAJES.CAMPOS_INVALIDOS };
  }

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      return { error: MENSAJES.NO_ENCONTRADO };
    }

    return { datos: cliente };
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};

export const obtenerClientes = async (): Promise<RespuestaCliente> => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
    return { datos: clientes };
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return { error: MENSAJES.NO_ENCONTRADO };
  }
};


export const obtenerCantidadClientes = async (): Promise<RespuestaCliente> => {
  try {
    const cantidad = await prisma.cliente.count();
    return { datos: cantidad };
  } catch (error) {
    console.error("Error al obtener la cantidad total de clientes:", error);
    return { error: "Error al obtener la cantidad total de clientes." };
  }
};

export const obtenerClientesHoy = async (): Promise<RespuestaCliente> => {
  const hoy = new Date();
  const inicioDia = new Date(hoy.setHours(0, 0, 0, 0)); // Comienzo de hoy

  try {
    const cantidadHoy = await prisma.cliente.count({
      where: {
        creadoEn: {
          gte: inicioDia, // Mayor o igual a la fecha de inicio del día
        },
      },
    });
    return { datos: cantidadHoy };
  } catch (error) {
    console.error(
      "Error al obtener la cantidad de clientes registrados hoy:",
      error
    );
    return {
      error: "Error al obtener la cantidad de clientes registrados hoy.",
    };
  }
};

export const obtenerClientesSemana = async (): Promise<RespuestaCliente> => {
  const hoy = new Date();
  const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay())); // Comienzo de la semana (lunes)

  try {
    const cantidadSemana = await prisma.cliente.count({
      where: {
        creadoEn: {
          gte: inicioSemana, // Mayor o igual a la fecha de inicio de la semana
        },
      },
    });
    return { datos: cantidadSemana };
  } catch (error) {
    console.error(
      "Error al obtener la cantidad de clientes registrados esta semana:",
      error
    );
    return {
      error:
        "Error al obtener la cantidad de clientes registrados esta semana.",
    };
  }
};

export const obtenerClientesMes = async (): Promise<RespuestaCliente> => {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Primer día del mes

  try {
    const cantidadMes = await prisma.cliente.count({
      where: {
        creadoEn: {
          gte: inicioMes, // Mayor o igual al primer día del mes
        },
      },
    });
    return { datos: cantidadMes };
  } catch (error) {
    console.error(
      "Error al obtener la cantidad de clientes registrados este mes:",
      error
    );
    return {
      error: "Error al obtener la cantidad de clientes registrados este mes.",
    };
  }
};
