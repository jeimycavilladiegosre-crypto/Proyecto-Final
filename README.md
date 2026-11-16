# Distribuidora Selecta — Tienda académica de licores

Proyecto integrador del Taller de Bootstrap 5 (Opción A). Tienda virtual **académica**: no procesa pagos ni ventas reales. Productos, precios y datos son ficticios.

## Tecnologías
HTML5, CSS3, Bootstrap 5.3 (CDN), JavaScript (vanilla), GitHub Pages.

## Secciones
Inicio, Catálogo (10 tarjetas), Promociones (carrusel) y Contacto (formulario validado).

## Funcionalidades
- Aviso y verificación de mayoría de edad (modal).
- Catálogo con búsqueda, filtro por categoría y orden por precio.
- Modal de detalles por producto.
- Carrito simulado: agregar, sumar/restar, quitar, vaciar, subtotal, descuento, IVA 19% y total.
- **Extras:** código de descuento `SELECTA10`, carrito que se conserva con `localStorage`, notificaciones (toast) y validación de edad por fecha de nacimiento.
- Accesibilidad básica: etiquetas, `aria-label`, enlace para saltar al catálogo, foco visible, `prefers-reduced-motion`.

## Componentes Bootstrap usados
Grid (`container`, `row`, `col-*`), `navbar`, `card`, `modal`, `offcanvas`, `carousel`, `alert`, `toast`, formularios con `needs-validation`, `badge`, `btn-group`.

## Estructura
```
index.html
css/styles.css
js/app.js
img/        (capturas)
```

## Uso
Abre `index.html` en el navegador o visita la URL de GitHub Pages.


## Autor
[Jeimy Carolina, Laura Camila] — 2026


## Funciones extra (trabajo en pareja)
- **Favoritos:** botón de corazón en cada tarjeta y filtro "Solo favoritos" (se guardan con `localStorage`).
- **Reseñas:** calificación de 1 a 5 estrellas y comentario por producto; el promedio aparece en la tarjeta.
- **Envío por ciudad:** costo según la ciudad elegida; gratis desde $300.000.
- **Checkout simulado:** formulario validado (nombre, documento, dirección, método de pago, mayoría de edad).
- **Comprobante imprimible** y **historial de pedidos** ("Mis pedidos").

## Integrantes y roles
| Integrante | Responsabilidad principal |
|---|---|
| [Jeimy Carolina Villadiegos Reina] | Catálogo, filtros, favoritos y reseñas |
| [Laura Camila Gutierrez Casas] | Carrito, envío, checkout, comprobante e historial |


