// app/api/productos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tiendaId = searchParams.get("tiendaId");
    const categoria = searchParams.get("categoria");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (tiendaId) where.tiendaId = tiendaId;
    if (categoria) where.categoria = categoria;

    const productos = await prisma.producto.findMany({
      where,
      include: {
        tienda: {
          select: {
            nombre: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error en GET /api/productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 },
    );
  }
}

// POST - Crear producto
export async function POST(request: NextRequest) {
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
      tiendaId,
    } = body;

    // Verificar que la tienda pertenece al usuario
    const tienda = await prisma.tienda.findFirst({
      where: {
        id: tiendaId,
        usuarioId: session.user.id,
      },
    });

    if (!tienda) {
      return NextResponse.json(
        { error: "Tienda no encontrada o no autorizada" },
        { status: 404 },
      );
    }

    const slug = nombre
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const producto = await prisma.producto.create({
      data: {
        nombre,
        slug,
        descripcion,
        precio: parseFloat(precio),
        precioOferta: precioOferta ? parseFloat(precioOferta) : null,
        imagenes: imagenes || [],
        categoria,
        subcategoria,
        stock: parseInt(stock),
        esNuevo: esNuevo || false,
        esDestacado: esDestacado || false,
        tieneEnvioGratis: tieneEnvioGratis || false,
        tiendaId,
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/productos:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 },
    );
  }
}
