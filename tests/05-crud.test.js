const test = require("node:test");
const assert = require("node:assert/strict");
const { pedir, esperarEstado, esperarPlan } = require("./app");

// Cada test crea sus propios planes: no importa qué haya en la base.
const marca = Date.now() % 100000;
const NO_EXISTE = 987654321;

// Crea un plan y revisa que el POST funcione, para que los demás tests prueben lo de hoy.
async function crearPlan(nombre, duracionMeses, precio) {
  const datos = { nombre: `${nombre} ${marca}`, duracionMeses, precio };
  const r = await pedir("POST", "/api/planes", datos);
  esperarEstado(r, [200, 201], "POST /api/planes", "primero termina la fase 1");
  assert.ok(r.json && Number.isInteger(r.json.id), "POST /api/planes debería devolver el plan con su id");
  return { id: r.json.id, ...datos };
}

test("GET /api/planes/{id} responde 404 si el plan no existe", async () => {
  await crearPlan("Plan prueba 404", 1, 100000);
  const r = await pedir("GET", `/api/planes/${NO_EXISTE}`);
  esperarEstado(r, 404, `GET /api/planes/${NO_EXISTE}`, r.status === 200 ? "con orElse(null) responde 200 vacío: usa ResponseEntity.notFound().build()" : "");
});

test("POST /api/planes responde 201 Created", async () => {
  const datos = { nombre: `Plan trimestral ${marca}`, duracionMeses: 3, precio: 330000 };
  const r = await pedir("POST", "/api/planes", datos);
  esperarEstado(r, 201, "POST /api/planes", r.status === 200 ? "usa ResponseEntity.status(HttpStatus.CREATED).body(...)" : "");
  esperarPlan(r.json, datos, "POST /api/planes");
});

test("PUT /api/planes/{id} actualiza el plan y el cambio queda guardado", async () => {
  const plan = await crearPlan("Plan mensual", 1, 120000);
  const cambios = { nombre: `Plan mensual plus ${marca}`, duracionMeses: 1, precio: 135000 };
  const r = await pedir("PUT", `/api/planes/${plan.id}`, cambios);
  esperarEstado(r, 200, `PUT /api/planes/${plan.id}`, r.status === 405 ? "¿falta el método con @PutMapping(\"/{id}\")?" : "");
  esperarPlan(r.json, { id: plan.id, ...cambios }, `PUT /api/planes/${plan.id}`, "¿copiaste los datos nuevos al plan encontrado?");
  const despues = await pedir("GET", `/api/planes/${plan.id}`);
  esperarEstado(despues, 200, `GET /api/planes/${plan.id} después del PUT`);
  esperarPlan(despues.json, { id: plan.id, ...cambios }, `GET /api/planes/${plan.id} después del PUT`, "¿llamaste a save después de cambiar el plan?");
});

test("PUT /api/planes/{id} responde 404 si el plan no existe", async () => {
  await crearPlan("Plan prueba PUT", 1, 100000);
  const r = await pedir("PUT", `/api/planes/${NO_EXISTE}`, { nombre: "Fantasma", duracionMeses: 1, precio: 1000 });
  esperarEstado(r, 404, `PUT /api/planes/${NO_EXISTE}`, r.status === 405 ? "¿falta el método con @PutMapping(\"/{id}\")?" : r.status === 200 ? "¿creaste un plan nuevo en vez de responder 404?" : "");
});

test("DELETE /api/planes/{id} responde 204 y el plan ya no existe", async () => {
  const plan = await crearPlan("Plan para retirar", 1, 50000);
  const r = await pedir("DELETE", `/api/planes/${plan.id}`);
  esperarEstado(r, 204, `DELETE /api/planes/${plan.id}`, r.status === 405 ? "¿falta el método con @DeleteMapping(\"/{id}\")?" : r.status === 200 ? "usa ResponseEntity.noContent().build()" : "");
  const despues = await pedir("GET", `/api/planes/${plan.id}`);
  esperarEstado(despues, 404, `GET /api/planes/${plan.id} después del DELETE`, "¿llamaste a deleteById?");
});

test("DELETE /api/planes/{id} responde 404 si el plan no existe", async () => {
  const plan = await crearPlan("Plan prueba DELETE", 1, 50000);
  const primero = await pedir("DELETE", `/api/planes/${plan.id}`);
  esperarEstado(primero, 204, `DELETE /api/planes/${plan.id}`, primero.status === 405 ? "¿falta el método con @DeleteMapping(\"/{id}\")?" : "");
  const r = await pedir("DELETE", `/api/planes/${plan.id}`);
  esperarEstado(r, 404, `DELETE /api/planes/${plan.id} por segunda vez`, "revisa con existsById antes de borrar");
});
