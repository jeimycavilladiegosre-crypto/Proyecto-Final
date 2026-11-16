/* Distribuidora Selecta - lógica de la tienda simulada */
const IVA = 0.19;
const CUPON = { codigo: "SELECTA10", porcentaje: 0.10 };

// 1) Datos: 10 productos de ejemplo (ficticios)
const productos = [
  // Marcas reales, precios ficticios. Para foto real: agrega img: "img/archivo.jpg"
  { id: 1, nombre: "Casillero del Diablo Cabernet Sauvignon", categoria: "Vinos", tipo: "vino", precio: 79900, oferta: 15, color: "#ff2d6f", img: "", desc: "Tinto chileno de cuerpo medio, notas de ciruela y vainilla.", info: "750 ml · 13,5% vol." },
  { id: 2, nombre: "Gato Negro Sauvignon Blanc", categoria: "Vinos", tipo: "vino", precio: 54900, oferta: 0, color: "#c6ff3c", img: "", desc: "Blanco fresco y cítrico, ideal con pescados y ensaladas.", info: "750 ml · 12,5% vol." },
  { id: 3, nombre: "Johnnie Walker Black Label 12", categoria: "Whisky", tipo: "whisky", precio: 219900, oferta: 0, color: "#ffb02e", img: "", desc: "Blended scotch de doce años con final ahumado y suave.", info: "750 ml · 40% vol." },
  { id: 4, nombre: "Buchanan's 12 Años", categoria: "Whisky", tipo: "whisky", precio: 189900, oferta: 10, color: "#ff7a1a", img: "", desc: "Whisky escocés suave, muy popular para compartir.", info: "750 ml · 40% vol." },
  { id: 5, nombre: "Old Parr 12 Años", categoria: "Whisky", tipo: "whisky", precio: 179900, oferta: 0, color: "#ffe14d", img: "", desc: "Escocés de doce años, notas de miel y frutos secos.", info: "750 ml · 40% vol." },
  { id: 6, nombre: "Ron Medellín Añejo 8 Años", categoria: "Ron", tipo: "ron", precio: 79900, oferta: 0, color: "#ff4d2e", img: "", desc: "Ron colombiano añejado, notas de caramelo y madera.", info: "750 ml · 40% vol." },
  { id: 7, nombre: "Havana Club Añejo 7 Años", categoria: "Ron", tipo: "ron", precio: 99900, oferta: 10, color: "#ff9f1c", img: "", desc: "Ron cubano de sabor redondo, perfecto solo o en cóctel.", info: "700 ml · 40% vol." },
  { id: 8, nombre: "Don Julio Reposado", categoria: "Tequila", tipo: "tequila", precio: 299900, oferta: 0, color: "#00f0ff", img: "", desc: "Tequila 100% agave reposado, suave y con toques de roble.", info: "750 ml · 38% vol." },
  { id: 9, nombre: "Aguardiente Antioqueño Tapa Azul", categoria: "Aguardiente", tipo: "tequila", precio: 62900, oferta: 0, color: "#3d8bff", img: "", desc: "El aguardiente tradicional de Antioquia con sabor a anís.", info: "750 ml · 29% vol." },
  { id: 10, nombre: "Tanqueray London Dry Gin", categoria: "Ginebra", tipo: "ron", precio: 129900, oferta: 10, color: "#19ffb0", img: "", desc: "Ginebra clásica con enebro, ideal para gin tonic.", info: "700 ml · 43,1% vol." },
  { id: 11, nombre: "Club Colombia Dorada x6", categoria: "Cerveza", tipo: "lata", precio: 24900, oferta: 0, color: "#ffd21f", img: "", desc: "Seis latas de cerveza dorada colombiana, ligera y refrescante.", info: "6 x 330 ml · 4,7% vol." },
  { id: 12, nombre: "Heineken x6", categoria: "Cerveza", tipo: "lata", precio: 29900, oferta: 0, color: "#39ff14", img: "", desc: "Seis latas de lager holandesa, sabor limpio y amargor suave.", info: "6 x 330 ml · 5% vol." }
];

// 2) Estado: carrito { id: cantidad } guardado en localStorage
let carrito = {};
let cuponActivo = false;
let productoModal = null;
try { carrito = JSON.parse(localStorage.getItem("carrito")) || {}; cuponActivo = localStorage.getItem("cupon") === "1"; } catch (e) {}

const $ = (id) => document.getElementById(id);
const moneda = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const precioFinal = (p) => Math.round(p.precio * (1 - p.oferta / 100));
const FORMAS = {
  vino: '<rect x="25" y="0" width="10" height="14" rx="2" fill="#15101f"/><path d="M25 14h10v26c8 8 12 14 12 26v46a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6V66c0-12 4-18 12-26z" fill="C"/><rect x="17" y="78" width="26" height="26" rx="2" fill="#fff" opacity=".9"/>',
  whisky: '<rect x="21" y="0" width="18" height="14" rx="2" fill="#15101f"/><path d="M21 14h18v8c10 4 15 8 15 18v68a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V40c0-10 5-14 15-18z" fill="C"/><rect x="12" y="52" width="36" height="34" rx="2" fill="#fff" opacity=".9"/>',
  ron: '<rect x="23" y="0" width="14" height="14" rx="2" fill="#15101f"/><path d="M24 14h12v16c12 6 16 12 16 24v54a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V54c0-12 4-18 16-24z" fill="C"/><rect x="14" y="60" width="32" height="32" rx="3" fill="#fff" opacity=".9"/>',
  tequila: '<rect x="24" y="0" width="12" height="12" rx="2" fill="#15101f"/><path d="M24 12h12v24c10 6 14 12 14 24v48a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V60c0-12 4-18 14-24z" fill="C"/><rect x="15" y="64" width="30" height="30" rx="15" fill="#fff" opacity=".9"/>',
  lata: '<rect x="12" y="12" width="36" height="98" rx="8" fill="C"/><rect x="16" y="6" width="28" height="9" rx="3" fill="#cfd8dc"/><rect x="12" y="44" width="36" height="34" fill="#000" opacity=".35"/>'
};
const botella = (tipo, color, w = 60) => `<svg viewBox="0 0 60 120" width="${w}" style="filter:drop-shadow(0 0 10px ${color})" aria-hidden="true">${(FORMAS[tipo] || FORMAS.ron).replaceAll('"C"', `"${color}"`)}</svg>`;
// Foto real si existe p.img; si falla la carga, se muestra la botella neón
window.respaldo = (id) => { const p = productos.find(x => x.id === id); return botella(p.tipo, p.color, 90); };
const imagen = (p, w = 90) => p.img ? `<img src="${p.img}" alt="${p.nombre}" loading="lazy" onerror="this.outerHTML=respaldo(${p.id})">` : botella(p.tipo, p.color, w);

// 2b) Extras de pareja: favoritos, reseñas, envío y pedidos
const leer = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } };
const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let favoritos = leer("favoritos", []);
let resenas = leer("resenas", {});
let pedidos = leer("pedidos", []);
let soloFav = false, estSel = 0, ultimo = { unidades: 0, total: 0 };
const ENVIOS = { "Bogotá": 12000, "Medellín": 18000, "Cali": 18000, "Barranquilla": 22000, "Otra ciudad": 28000 };
const ENVIO_GRATIS = 300000;
const resenasDe = (id) => resenas[id] || [];
const promedio = (id) => { const r = resenasDe(id); return r.length ? r.reduce((a, x) => a + x.est, 0) / r.length : 0; };
const estrellasTxt = (id) => resenasDe(id).length ? `<span class="text-warning">★ ${promedio(id).toFixed(1)}</span> <span class="text-muted">(${resenasDe(id).length})</span>` : `<span class="text-muted">Sin reseñas</span>`;

// 3) Catálogo: filtros y pintado de tarjetas
function pintarCatalogo() {
  const texto = $("buscar").value.trim().toLowerCase();
  const cat = $("categoria").value;
  const orden = $("orden").value;
  let lista = productos.filter(p => (cat === "todas" || p.categoria === cat) && p.nombre.toLowerCase().includes(texto) && (!soloFav || favoritos.includes(p.id)));
  if (orden === "menor") lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === "mayor") lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else lista.sort((a, b) => a.nombre.localeCompare(b.nombre));

  $("grilla").innerHTML = lista.map(p => `
    <div class="col-12 col-sm-6 col-lg-3">
      <article class="card card-prod position-relative">
        <button class="btn-fav" data-fav="${p.id}" aria-pressed="${favoritos.includes(p.id)}" aria-label="Favorito: ${p.nombre}">${favoritos.includes(p.id) ? "♥" : "♡"}</button>
        ${p.oferta ? `<span class="badge badge-promo">-${p.oferta}%</span>` : ""}
        <div class="card-img-box" style="--glow:${p.color}">${imagen(p, 80)}</div>
        <div class="card-body d-flex flex-column">
          <h3 class="h6 card-title mb-1">${p.nombre}</h3>
          <p class="small text-muted mb-1">${p.categoria}</p><p class="small mb-2">${estrellasTxt(p.id)}</p>
          <div class="mb-3">${p.oferta ? `<span class="precio-old">${moneda(p.precio)}</span><br>` : ""}<strong class="precio">${moneda(precioFinal(p))}</strong></div>
          <div class="mt-auto d-grid gap-2">
            <button class="btn btn-outline-dark btn-sm" data-detalle="${p.id}">Ver detalles</button>
            <button class="btn btn-brass btn-sm" data-agregar="${p.id}">Agregar</button>
          </div>
        </div>
      </article>
    </div>`).join("");
  $("vacio").classList.toggle("d-none", lista.length > 0);
}

// 4) Carrito: agregar, quitar, calcular totales
function agregar(id) {
  carrito[id] = (carrito[id] || 0) + 1;
  guardar();
  const p = productos.find(x => x.id === id);
  avisar(`${p.nombre} agregado al carrito`);
}
function cambiarCantidad(id, delta) {
  carrito[id] = (carrito[id] || 0) + delta;
  if (carrito[id] <= 0) delete carrito[id];
  guardar();
}
function guardar() {
  try { localStorage.setItem("carrito", JSON.stringify(carrito)); localStorage.setItem("cupon", cuponActivo ? "1" : "0"); } catch (e) {}
  pintarCarrito();
}
function pintarCarrito() {
  const ids = Object.keys(carrito).map(Number);
  let sub = 0, unidades = 0;
  $("items").innerHTML = ids.length ? ids.map(id => {
    const p = productos.find(x => x.id === id), q = carrito[id], pf = precioFinal(p);
    sub += pf * q; unidades += q;
    return `<div class="cart-item d-flex align-items-center gap-2">
      <div class="mini">${botella(p.tipo, p.color, 30)}</div>
      <div class="flex-grow-1"><div class="small fw-bold">${p.nombre}</div><div class="small text-muted">${moneda(pf)} c/u</div>
        <div class="btn-group btn-group-sm mt-1" role="group" aria-label="Cantidad de ${p.nombre}">
          <button class="btn btn-outline-secondary" data-menos="${id}" aria-label="Quitar una unidad">−</button>
          <span class="btn btn-light disabled">${q}</span>
          <button class="btn btn-outline-secondary" data-mas="${id}" aria-label="Agregar una unidad">+</button></div></div>
      <div class="text-end"><div class="small fw-bold">${moneda(pf * q)}</div><button class="btn btn-link btn-sm text-danger p-0" data-quitar="${id}">Quitar</button></div>
    </div>`;
  }).join("") : `<p class="text-muted text-center mt-4">Tu carrito está vacío. Agrega productos desde el catálogo.</p>`;

  const desc = cuponActivo ? Math.round(sub * CUPON.porcentaje) : 0;
  const base = sub - desc;
  const iva = Math.round(base * IVA);
  const envio = unidades === 0 || base + iva >= ENVIO_GRATIS ? 0 : ENVIOS[$("ciudad").value];
  ultimo = { sub, desc, iva, envio, total: base + iva + envio, unidades };
  $("tEnvio").textContent = envio === 0 && unidades > 0 ? "Gratis" : moneda(envio);
  $("tSub").textContent = moneda(sub);
  $("tDesc").textContent = "-" + moneda(desc);
  $("tIva").textContent = moneda(iva);
  $("tTotal").textContent = moneda(ultimo.total);
  $("contador").textContent = unidades;
}

// 5) Aviso (toast) y cupón
function avisar(msg) { $("toastTxt").textContent = msg; bootstrap.Toast.getOrCreateInstance($("toast"), { delay: 2200 }).show(); }
function aplicarCupon() {
  const v = $("cupon").value.trim().toUpperCase();
  const m = $("msgCupon");
  if (v === CUPON.codigo) { cuponActivo = true; m.textContent = "Cupón aplicado: 10% de descuento."; m.className = "small mb-2 text-success"; }
  else { cuponActivo = false; m.textContent = "Código no válido."; m.className = "small mb-2 text-danger"; }
  guardar();
}

// 6) Eventos (delegación sobre documento)
document.addEventListener("click", (e) => {
  const t = e.target.closest("button"); if (!t) return;
  const d = t.dataset;
  if (d.agregar) agregar(+d.agregar);
  else if (d.mas) cambiarCantidad(+d.mas, 1);
  else if (d.menos) cambiarCantidad(+d.menos, -1);
  else if (d.quitar) { delete carrito[d.quitar]; guardar(); }
  else if (d.detalle) abrirDetalle(+d.detalle);
  else if (d.fav) alternarFavorito(+d.fav);
  else if (d.est) { estSel = +d.est; pintarFormEstrellas(); }
});
function abrirDetalle(id) {
  const p = productos.find(x => x.id === id); productoModal = p;
  $("dTitulo").textContent = p.nombre;
  $("dImg").innerHTML = `<div class="card-img-box rounded-3" style="--glow:${p.color}">${imagen(p, 90)}</div>`;
  $("dDesc").textContent = p.desc;
  $("dPrecio").textContent = moneda(precioFinal(p));
  $("dMeta").textContent = p.info + (p.oferta ? ` · ${p.oferta}% de descuento` : "");
  estSel = 0; pintarFormEstrellas(); $("dComentario").value = ""; pintarResenas();
  bootstrap.Modal.getOrCreateInstance($("modalDetalle")).show();
}
$("dAgregar").addEventListener("click", () => { agregar(productoModal.id); bootstrap.Modal.getInstance($("modalDetalle")).hide(); });
$("btnCupon").addEventListener("click", aplicarCupon);
$("btnVaciar").addEventListener("click", () => { carrito = {}; cuponActivo = false; $("cupon").value = ""; $("msgCupon").textContent = ""; guardar(); });

["buscar", "categoria", "orden"].forEach(id => $(id).addEventListener("input", pintarCatalogo));

// 6b) Favoritos
function alternarFavorito(id) {
  favoritos = favoritos.includes(id) ? favoritos.filter(x => x !== id) : [...favoritos, id];
  escribir("favoritos", favoritos);
  pintarCatalogo();
}
$("btnSoloFav").addEventListener("click", (e) => {
  soloFav = !soloFav;
  e.currentTarget.setAttribute("aria-pressed", soloFav);
  e.currentTarget.textContent = (soloFav ? "♥ " : "♡ ") + "Favoritos";
  pintarCatalogo();
});

// 6c) Reseñas con estrellas
function pintarFormEstrellas() {
  $("dEstrellas").innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" class="btn btn-sm btn-outline-warning" data-est="${n}" aria-label="${n} de 5 estrellas">${n <= estSel ? "★" : "☆"}</button>`).join(" ");
}
function pintarResenas() {
  const r = resenasDe(productoModal.id).slice(-3).reverse();
  $("dResenas").innerHTML = r.length ? r.map(x => `<li class="mb-1"><span class="text-warning">${"★".repeat(x.est)}</span> ${esc(x.txt) || "<em class='text-muted'>Sin comentario</em>"} <span class="text-muted">· ${x.fecha}</span></li>`).join("") : `<li class="text-muted">Aún no hay reseñas. ¡Sé el primero!</li>`;
}
$("dEnviarResena").addEventListener("click", () => {
  if (!estSel) return avisar("Elige una calificación de 1 a 5 estrellas.");
  const id = productoModal.id;
  resenas[id] = [...resenasDe(id), { est: estSel, txt: $("dComentario").value.trim(), fecha: new Date().toLocaleDateString("es-CO") }];
  escribir("resenas", resenas);
  estSel = 0; pintarFormEstrellas(); $("dComentario").value = ""; pintarResenas(); pintarCatalogo();
  avisar("Reseña publicada. ¡Gracias!");
});

// 6d) Envío por ciudad, checkout con comprobante e historial de pedidos
$("ciudad").addEventListener("change", pintarCarrito);
$("btnComprar").addEventListener("click", () => {
  if (!Object.keys(carrito).length) return avisar("Agrega productos antes de finalizar.");
  $("pResumen").textContent = `${ultimo.unidades} productos · Envío a ${$("ciudad").value} · Total ${moneda(ultimo.total)}`;
  $("formPedido").classList.remove("d-none", "was-validated");
  $("comprobante").classList.add("d-none");
  bootstrap.Offcanvas.getOrCreateInstance($("carrito")).hide();
  bootstrap.Modal.getOrCreateInstance($("modalPedido")).show();
});
function htmlComprobante(p) {
  return `<h2 class="h5">Comprobante ${p.num}</h2><p class="small mb-2">${p.fecha}<br>Cliente: ${esc(p.cliente)} · Doc. ${esc(p.doc)}<br>Entrega: ${esc(p.dir)}, ${esc(p.ciudad)}<br>Pago: ${esc(p.pago)}</p>
  <table class="table table-sm"><thead><tr><th>Producto</th><th>Cant.</th><th class="text-end">Subtotal</th></tr></thead><tbody>${p.items.map(i => `<tr><td>${esc(i.nombre)}</td><td>${i.q}</td><td class="text-end">${moneda(i.pf * i.q)}</td></tr>`).join("")}</tbody></table>
  <p class="mb-1">Subtotal: ${moneda(p.sub)} · Descuento: -${moneda(p.desc)} · IVA: ${moneda(p.iva)} · Envío: ${p.envio ? moneda(p.envio) : "Gratis"}</p>
  <p class="fs-5 fw-bold">Total: ${moneda(p.total)}</p><p class="small">Comprobante simulado: no se realizó ningún cobro.</p>
  <div class="d-flex gap-2 no-print"><button class="btn btn-brass" onclick="window.print()">Imprimir comprobante</button><button class="btn btn-outline-dark" data-bs-dismiss="modal">Cerrar</button></div>`;
}
$("formPedido").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target; f.classList.add("was-validated");
  if (!f.checkValidity()) return;
  const items = Object.keys(carrito).map(id => { const p = productos.find(x => x.id === +id); return { nombre: p.nombre, q: carrito[id], pf: precioFinal(p) }; });
  const pedido = { num: "SEL-" + Date.now().toString().slice(-6), fecha: new Date().toLocaleString("es-CO"), cliente: $("pNombre").value.trim(), doc: $("pDoc").value, dir: $("pDir").value.trim(), ciudad: $("ciudad").value, pago: $("pPago").value, items, ...ultimo };
  pedidos.push(pedido); escribir("pedidos", pedidos);
  $("comprobante").innerHTML = htmlComprobante(pedido);
  f.reset(); f.classList.add("d-none"); $("comprobante").classList.remove("d-none");
  carrito = {}; cuponActivo = false; $("cupon").value = ""; $("msgCupon").textContent = ""; guardar();
});
function pintarPedidos() {
  $("listaPedidos").innerHTML = pedidos.length ? pedidos.slice().reverse().map(p => `<div class="neon-box p-3 mb-2"><div class="d-flex justify-content-between"><strong>${p.num}</strong><span class="precio">${moneda(p.total)}</span></div><div class="small text-muted">${p.fecha} · ${p.items.reduce((a, i) => a + i.q, 0)} productos · ${esc(p.ciudad)}</div></div>`).join("") : `<p class="text-muted text-center mb-0">Aún no tienes pedidos. Finaliza una compra simulada y aparecerá aquí.</p>`;
}
$("modalHistorial").addEventListener("show.bs.modal", pintarPedidos);
$("btnBorrarPedidos").addEventListener("click", () => { pedidos = []; escribir("pedidos", pedidos); pintarPedidos(); });

// 7) Verificación de edad (modal inicial)
const modalEdad = new bootstrap.Modal($("modalEdad"));
let esMayor = false;
try { esMayor = sessionStorage.getItem("mayor") === "1"; } catch (e) {}
if (!esMayor) modalEdad.show();
$("btnSi").addEventListener("click", () => { try { sessionStorage.setItem("mayor", "1"); } catch (e) {} modalEdad.hide(); });
$("btnNo").addEventListener("click", () => {
  document.querySelector("#modalEdad .modal-body").innerHTML = `<h2 class="h4">Acceso restringido</h2><p class="text-muted mb-0">Lo sentimos, este sitio es solo para mayores de 18 años.</p>`;
  document.querySelector("main").remove();
});

// 8) Formulario con validación (Bootstrap + edad calculada)
$("formContacto").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, nac = $("nacimiento");
  const hoy = new Date(), n = new Date(nac.value);
  let edad = hoy.getFullYear() - n.getFullYear();
  if (hoy < new Date(hoy.getFullYear(), n.getMonth(), n.getDate())) edad--;
  const edadOk = nac.value !== "" && edad >= 18;
  nac.setCustomValidity(edadOk ? "" : "menor");
  $("errEdad").textContent = nac.value ? "Debes ser mayor de 18 años." : "Ingresa tu fecha de nacimiento.";
  f.classList.add("was-validated");
  if (f.checkValidity()) { f.reset(); f.classList.remove("was-validated"); $("okContacto").classList.remove("d-none"); }
});

// 9) Inicio: categorías, botellas del hero y primer pintado
[...new Set(productos.map(p => p.categoria))].sort().forEach(c => $("categoria").insertAdjacentHTML("beforeend", `<option>${c}</option>`));
$("heroBotellas").innerHTML = [["vino","#ff2bd6"],["whisky","#00f0ff"],["lata","#b6ff3c"],["ron","#ffb02e"]].map(([t,c]) => botella(t, c, 70)).join("");
pintarCatalogo();
pintarCarrito();
