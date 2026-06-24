// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando datos de prueba...");

  // Crear usuario admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@portal.com" },
    update: {},
    create: {
      email: "admin@portal.com",
      name: "Administrador",
      role: "ADMIN",
    },
  });

  console.log(`✅ Usuario admin creado: ${admin.email}`);

  // Crear tiendas de ejemplo
  const tiendas = await Promise.all([
    prisma.tienda.create({
      data: {
        nombre: "Moda & Estilo",
        slug: "moda-estilo",
        logo: "https://picsum.photos/seed/moda/200/200",
        portada: "https://picsum.photos/seed/moda-portada/1200/400",
        descripcion: "Tienda de moda con las últimas tendencias",
        categoria: "Ropa y Moda",
        ubicacion: "Madrid",
        telefono: "+34 911 234 567",
        email: "info@modaestilo.com",
        esOficial: true,
        esVerificada: true,
        rating: 4.8,
        totalReviews: 128,
        nivel: "PLATA",
      },
    }),
    prisma.tienda.create({
      data: {
        nombre: "TecnoShop",
        slug: "tecno-shop",
        logo: "https://picsum.photos/seed/tecno/200/200",
        portada: "https://picsum.photos/seed/tecno-portada/1200/400",
        descripcion: "Los mejores gadgets y tecnología",
        categoria: "Electrónica",
        ubicacion: "Barcelona",
        telefono: "+34 932 345 678",
        email: "info@tecno-shop.com",
        esOficial: true,
        esVerificada: true,
        rating: 4.9,
        totalReviews: 256,
        nivel: "ORO",
      },
    }),
    prisma.tienda.create({
      data: {
        nombre: "Hogar & Deco",
        slug: "hogar-deco",
        logo: "https://picsum.photos/seed/hogar/200/200",
        portada: "https://picsum.photos/seed/hogar-portada/1200/400",
        descripcion: "Decora tu hogar con estilo",
        categoria: "Hogar y Deco",
        ubicacion: "Valencia",
        telefono: "+34 963 456 789",
        email: "info@hogardeco.com",
        esOficial: false,
        esVerificada: true,
        rating: 4.7,
        totalReviews: 89,
        nivel: "BRONCE",
      },
    }),
  ]);

  console.log(`✅ ${tiendas.length} tiendas creadas`);

  // Crear productos para cada tienda
  for (const tienda of tiendas) {
    const productos = await Promise.all(
      Array.from({ length: 8 }).map((_, i) => {
        const categorias = [
          "Ropa",
          "Electrónica",
          "Hogar",
          "Deportes",
          "Libros",
          "Juguetes",
        ];
        const nombres = [
          "Camiseta Premium",
          "Auriculares Bluetooth",
          "Lámpara LED",
          "Zapatillas Running",
          "Libro de Cocina",
          "Juego de Mesa",
          "Bolso de Cuero",
          "Reloj Inteligente",
        ];
        const nombre = `${nombres[i % nombres.length]} ${i + 1}`;
        const precio = Math.floor(Math.random() * 100000) + 1000;
        const tieneOferta = Math.random() > 0.6;

        return prisma.producto.create({
          data: {
            tiendaId: tienda.id,
            nombre,
            slug: `${tienda.slug}-producto-${i + 1}`,
            descripcion: `Excelente ${nombre} de alta calidad. Perfecto para ti.`,
            precio,
            precioOferta: tieneOferta ? Math.floor(precio * 0.7) : undefined,
            imagenes: [
              `https://picsum.photos/seed/${tienda.slug}-${i}/400/400`,
              `https://picsum.photos/seed/${tienda.slug}-${i}-2/400/400`,
            ],
            categoria: categorias[i % categorias.length],
            stock: Math.floor(Math.random() * 50) + 5,
            esNuevo: Math.random() > 0.7,
            esDestacado: Math.random() > 0.7,
            tieneEnvioGratis: Math.random() > 0.5,
            rating: 3.5 + Math.random() * 1.5,
            totalReviews: Math.floor(Math.random() * 200),
          },
        });
      }),
    );

    console.log(
      `✅ ${productos.length} productos creados para ${tienda.nombre}`,
    );
  }

  console.log("🎉 ¡Datos de prueba creados exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
