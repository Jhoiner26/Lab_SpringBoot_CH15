const test = require("node:test");
const assert = require("node:assert/strict");
const { exigirArchivo } = require("./app");

test("PlanRepository es una interfaz", () => {
  const codigo = exigirArchivo("PlanRepository.java");
  assert.match(codigo, /\binterface\s+PlanRepository\b/, "PlanRepository debería ser una interface, no una class");
});

test("PlanService es un @Service", () => {
  const codigo = exigirArchivo("PlanService.java");
  assert.match(codigo, /@Service\b/, "A PlanService le falta @Service: sin ella Spring no la crea");
  assert.match(codigo, /\bclass\s+PlanService\b/, "PlanService debería ser una clase: public class PlanService");
});

test("PlanService recibe el repositorio por su constructor", () => {
  const codigo = exigirArchivo("PlanService.java");
  assert.match(codigo, /\bPlanService\s*\([^)]*\bPlanRepository\s+\w+[^)]*\)\s*\{/, "PlanService debería tener un constructor que recibe un PlanRepository: public PlanService(PlanRepository planRepository)");
  assert.doesNotMatch(codigo, /new\s+PlanRepository\w*\s*\(/, "PlanService no debe crear el repositorio con new: lo recibe por el constructor y Spring se lo entrega");
});

test("PlanController recibe el servicio por su constructor y ya no guarda la lista", () => {
  const codigo = exigirArchivo("PlanController.java");
  assert.match(codigo, /\bPlanController\s*\([^)]*\bPlanService\s+\w+[^)]*\)\s*\{/, "PlanController debería tener un constructor que recibe un PlanService: public PlanController(PlanService planService)");
  assert.doesNotMatch(codigo, /new\s+(PlanService|PlanRepository\w*)\s*\(/, "PlanController no debe crear sus dependencias con new: las recibe por el constructor");
  assert.doesNotMatch(codigo, /private\s+(?:static\s+)?(?:final\s+)?(?:Array)?List\s*<\s*Plan\s*>/, "PlanController todavía guarda la lista de planes: la lista se muda al repositorio");
});
