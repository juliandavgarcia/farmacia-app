"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function buscarClientes(searchTerm: string) {
  try {
    const clientes = await prisma.cliente.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            documento: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        nombre: "asc",
      },
      take: 10,
    });

    return clientes;
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    return [];
  }
}

interface ClienteData {
  documento: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
}

export async function crearCliente(data: ClienteData) {
  try {
    const cliente = await prisma.cliente.create({
      data: {
        documento: data.documento,
        nombre: data.nombre,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
        correo: data.correo || null,
      },
    });

    revalidatePath("/ventas");
    return cliente;
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    throw new Error("No se pudo crear el cliente");
  }
}
