const test = require("node:test");
const assert = require("node:assert/strict");
const { pedir, esperarEstado, esperarPlan, exigirArchivo } = require("./app");

// Cada test crea sus propios planes: no importa qué haya en la base.
const marca = Date.now() % 100000;
const crearPlan = (nombre, duracionMeses, precio, extra = {}) =>
  pedir("POST", "/api/planes", { ...extra, nombre: `${nombre} ${marca}`, duracionMeses, precio });

test("la clase Plan tiene sus cuatro atributos privados", () => {
  const codigo = exigirArchivo("Plan.java");
  for (const [tipo, nombre] of [["Long", "id"], ["String", "nombre"], ["int", "duracionMeses"], ["int", "precio"]]) {
    assert.match(codigo, new RegExp(`private\\s+${tipo}\\s+${nombre}\\s*;`), `A Plan le falta el atributo: private ${tipo} ${nombre};`);
  }
});

test("POST /api/planes crea un plan y lo devuelve con su id", async () => {
  const r = await crearPlan("Plan semestral", 6, 630000);
  esperarEstado(r, [200, 201], "POST /api/planes", r.status === 404 ? "¿pusiste @RestController y @RequestMapping(\"/api/planes\")?" : r.status === 405 ? "¿falta el método con @PostMapping?" : "");
  esperarPlan(r.json, { nombre: `Plan semestral ${marca}`, duracionMeses: 6, precio: 630000 }, "POST /api/planes", "¿usaste @RequestBody?");
  assert.ok(Number.isInteger(r.json.id), `POST /api/planes debería devolver el plan con un id numérico y devolvió id = ${JSON.stringify(r.json.id)}`);
});

test("GET /api/planes trae la lista con el plan creado", async () => {
  await crearPlan("Plan estudiante", 1, 90000);
  const r = await pedir("GET", "/api/planes");
  esperarEstado(r, 200, "GET /api/planes", r.status === 405 ? "¿falta el método con @GetMapping?" : "");
  assert.ok(
    Array.isArray(r.json),
    r.texto.startsWith("[")
      ? `GET /api/planes trae un JSON cortado (${r.texto.length} caracteres): es el bucle Plan → socios → plan → … Devuelve PlanResponse, no la entidad (fase 5)`
      : `GET /api/planes debería traer una lista JSON [ ... ] y trajo: ${r.texto.slice(0, 120) || "nada"}`
  );
  const nombres = r.json.map((p) => p.nombre);
  assert.ok(nombres.includes(`Plan estudiante ${marca}`), `Después del POST, GET /api/planes debería incluir "Plan estudiante ${marca}" (¿el POST agrega el plan a la lista o a la base?)`);
});

test("GET /api/planes/{id} encuentra un plan por su id", async () => {
  const creado = await crearPlan("Plan empresarial", 12, 1000000);
  esperarEstado(creado, [200, 201], "POST /api/planes");
  assert.ok(creado.json && Number.isInteger(creado.json.id), "POST /api/planes debería devolver el plan con su id");
  const r = await pedir("GET", `/api/planes/${creado.json.id}`);
  esperarEstado(r, 200, `GET /api/planes/${creado.json.id}`, "¿usaste @GetMapping(\"/{id}\") y @PathVariable?");
  esperarPlan(r.json, { id: creado.json.id, nombre: `Plan empresarial ${marca}`, duracionMeses: 12, precio: 1000000 }, `GET /api/planes/${creado.json.id}`);
});

test("el id lo decide el servidor, no el cliente", async () => {
  const r = await crearPlan("Plan pareja", 1, 200000, { id: 99999 });
  esperarEstado(r, [200, 201], "POST /api/planes con \"id\": 99999");
  assert.ok(r.json && Number.isInteger(r.json.id), "POST /api/planes debería devolver el plan con su id");
  assert.notEqual(r.json.id, 99999, "POST /api/planes con \"id\": 99999 guardó el 99999: el servidor debe asignar el id aunque el cliente envíe otro (setId(null) o setId(...) antes de guardar)");
});
