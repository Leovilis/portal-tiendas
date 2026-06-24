// app/api/productos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: params.id },
      include: {
        tienda: {
          select: {
            nombre: true,
            slug: true,
            logo: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            usuario: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error en GET /api/productos/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      nombre,
      descripcion,
      precio,
      precioOferta,
      imagenes,
      categoria,
      subcategoria,
      stock,
      esNuevo,
      esDestacado,
      tieneEnvioGratis,
    } = body;

    // Verificar que el producto existe y pertenece al usuario
    const existingProduct = await prisma.producto.findUnique({
      where: { id: params.id },
      include: { tienda: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    if (existingProduct.tienda.usuarioId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const updatedProduct = await prisma.producto.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        precioOferta: precioOferta ? parseFloat(precioOferta) : null,
        imagenes,
        categoria,
        subcategoria,
        stock: parseInt(stock),
        esNuevo: esNuevo || false,
        esDestacado: esDestacado || false,
        tieneEnvioGratis: tieneEnvioGratis || false,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error en PUT /api/productos/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el producto existe y pertenece al usuario
    const existingProduct = await prisma.producto.findUnique({
      where: { id: params.id },
      include: { tienda: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    if (existingProduct.tienda.usuarioId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.producto.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error en DELETE /api/productos/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 },
    );
  }
}
