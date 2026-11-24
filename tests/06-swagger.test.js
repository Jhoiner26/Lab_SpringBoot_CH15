const test = require("node:test");
const assert = require("node:assert/strict");
const { pedir, esperarEstado, leer, problemaDeUbicacion } = require("./app");

test("el pom.xml tiene springdoc-openapi", () => {
  const ubicacion = problemaDeUbicacion();
  if (ubicacion) assert.fail(ubicacion);
  const xml = leer("pom.xml");
  assert.match(xml, /<groupId>org\.springdoc<\/groupId>\s*<artifactId>springdoc-openapi-starter-webmvc-ui<\/artifactId>\s*<version>[^<]+<\/version>/, "Falta la dependencia org.springdoc:springdoc-openapi-starter-webmvc-ui con su <version>3.2.0</version> en el pom.xml");
});

test("/v3/api-docs documenta las cinco operaciones de planes", async () => {
  const r = await pedir("GET", "/v3/api-docs");
  esperarEstado(r, 200, "GET /v3/api-docs", "¿agregaste springdoc al pom.xml y recargaste Maven?");
  assert.ok(r.json && r.json.paths, "GET /v3/api-docs debería traer el documento OpenAPI en JSON");
  const lista = r.json.paths["/api/planes"] || {};
  const uno = r.json.paths["/api/planes/{id}"] || {};
  for (const [ruta, metodo, ops] of [["/api/planes", "get", lista], ["/api/planes", "post", lista], ["/api/planes/{id}", "get", uno], ["/api/planes/{id}", "put", uno], ["/api/planes/{id}", "delete", uno]]) {
    assert.ok(ops[metodo], `La documentación no tiene ${metodo.toUpperCase()} ${ruta}: ¿existe ese método en PlanController?`);
  }
});

test("Swagger UI abre en el navegador", async () => {
  const r = await pedir("GET", "/swagger-ui/index.html");
  esperarEstado(r, 200, "GET /swagger-ui/index.html", "abre http://localhost:8080/swagger-ui.html en el navegador");
  assert.match(r.texto, /swagger/i, "/swagger-ui/index.html debería ser la página de Swagger UI");
});
