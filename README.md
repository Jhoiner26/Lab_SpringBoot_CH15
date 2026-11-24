# 🏋️ Cuerpo Activo · Lab Spring Boot

**Generation Colombia · TIFC2DEV-JAVA · Cohorte 15 · Proyecto espejo (individual)**

---

## ¿Qué es esto?

### El negocio

Cuerpo Activo es un gimnasio que vende planes de membresía: mensual, trimestral y anual.
La recepción, la página web y la app necesitan consultar los planes en un solo lugar.
Vas a construir esa **API**: el backend que guarda los planes y responde por HTTP.

### Es el espejo de Café Origen

En clase construimos la API de Café Origen. Tú construyes, sola o solo, la del gimnasio, en **cinco fases**.
Cada fase repite lo que hicimos en una sesión, con planes en vez de productos.

### Tu nota se calcula sola

Cada vez que subes tu código, un robot compila tu proyecto con Maven, **arranca tu API** y le hace peticiones, igual que tú con Postman.
En unos minutos ves tu nota (de 0.0 a 5.0) en tu Pull Request. Puedes corregir y subir las veces que quieras.

### ¿Qué es un test?

**Definición técnica:** un test es un programa que ejecuta tu código con datos conocidos y compara el resultado con el resultado correcto.

**En la vida real:** es como el cliente misterioso de un restaurante. Pide un plato y revisa que llegue lo que dice la carta.

### Los tests de estructura

Algunos tests revisan **cómo** está organizado tu código: por ejemplo, que `PlanService` reciba el repositorio por su constructor, o que `Plan` tenga `@Entity`. Si tu API responde bien, pero no está hecha como pide la fase, ese test no pasa.

---

## Las cinco fases

| # | Fase | Qué revisa | Tests | Tu nota al terminarla |
|---|---|---|---|---|
| 01 | 1 · Spring Boot | Tu proyecto del Initializr y que arranque | 5 | |
| 02 | 1 · Spring Boot | `Plan`, `GET` y `POST` | 5 | **1.4** |
| 03 | 2 · Capas | Interfaz, servicio e inyección por constructor | 4 | **1.9** |
| 04 | 3 · JPA | Entidad, `JpaRepository`, PostgreSQL y que los datos sobrevivan a un reinicio | 6 | **2.8** |
| 05 | 4 · CRUD completo | `404`, `201`, `PUT` y `DELETE` | 6 | |
| 06 | 4 · CRUD completo | Swagger | 3 | **4.0** |
| 07 | 5 · Socios y DTO | `Socio` con su `Plan`, los records y que el JSON no se rompa | 7 | **5.0** |

Las fases se hacen **en orden, sobre el mismo proyecto**: la fase 2 reorganiza la fase 1, la fase 3 cambia la lista en memoria por PostgreSQL, la fase 4 completa el CRUD y la fase 5 agrega los socios.

> **¿Tu nota bajó?** Si ya tenías 5.0 con tres fases, ahora verás 2.8: llegaron los tests de las fases 4 y 5. No perdiste nada: te faltan las dos fases nuevas.

---

## Antes de empezar

### Lo que necesitas instalado

- **JDK 25** (el del módulo de Java). En la terminal, `java -version` debe decir 25.
- **Node.js** (el del módulo de JavaScript). Solo se usa para `npm test`.
- **Git**, **IntelliJ IDEA** y **Postman**.
- **PostgreSQL y pgAdmin** (los del módulo de SQL), para la fase 3.

### Maven en IntelliJ

**Settings → Build, Execution, Deployment → Build Tools → Maven → Maven home path → Bundled (Maven 3)**.
Hazlo también en **File → New Projects Setup → Settings for New Projects** para que no se te olvide en proyectos nuevos.

---

## Paso 1 · Fork

### ¿Qué es un fork?

**Definición técnica:** un fork es una copia de un repositorio ajeno dentro de tu propia cuenta de GitHub.

**En la vida real:** es como fotocopiar el cuaderno de la profe. Escribes en tu copia; el original no cambia.

### Cómo hacerlo

1. Abre el enlace del repositorio que te compartió la profe.
2. Arriba a la derecha, clic en **Fork**.
3. Deja el nombre como está y clic en **Create fork**.

### ¿Quedó bien?

Arriba a la izquierda debe decir **tu-usuario / Lab_SpringBoot_CH15**, y debajo, en letra pequeña, *forked from* la cuenta de la profe.

---

## Paso 2 · Clone

### Copia la URL de TU fork

En tu fork (no en el de la profe): botón verde **Code** → pestaña **HTTPS** → copia la URL.

### Descárgalo a tu computador

Abre **Git Bash** en la carpeta donde guardas tus proyectos y escribe:

```bash
git clone URL-DE-TU-FORK
cd Lab_SpringBoot_CH15
```

---

## Fase 1 · Spring Boot (como la sesión 1)

### 1.1 · Genera el proyecto en el Initializr

Abre `https://start.spring.io` y llena así:

| Campo | Valor |
|---|---|
| Project | **Maven** (ojo: el Initializr trae marcado Gradle) |
| Language | Java |
| Spring Boot | La que viene marcada |
| Group | `co.cuerpoactivo` |
| Artifact | `cuerpo-activo-api` |
| Name | `cuerpo-activo-api` |
| Package name | Déjalo como lo propone (`co.cuerpoactivo.cuerpo_activo_api`) |
| Packaging | Jar |
| Configuration | Properties |
| Java | 17 |
| Dependencies | **Spring Web** |

Clic en **GENERATE**: se descarga `cuerpo-activo-api.zip`.

### 1.2 · Pon la carpeta en su lugar

Descomprime el zip y mueve la carpeta `cuerpo-activo-api` **dentro** de `Lab_SpringBoot_CH15`. Así debe quedar:

```text
Lab_SpringBoot_CH15/
├── cuerpo-activo-api/      ← tu proyecto
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
├── tests/
├── scripts/
├── package.json
└── README.md
```

**Ojo con la carpeta doble:** Windows a veces crea `cuerpo-activo-api/cuerpo-activo-api/`. El `pom.xml` debe quedar un solo nivel debajo de `Lab_SpringBoot_CH15`.

En IntelliJ: **File → Open** → elige la carpeta `cuerpo-activo-api` (la que tiene el `pom.xml`).

### 1.3 · La clase `Plan`

En el paquete principal, crea el paquete `model` y dentro `Plan.java`:

| Atributo | Tipo |
|---|---|
| `id` | `Long` |
| `nombre` | `String` |
| `duracionMeses` | `int` |
| `precio` | `int` |

Los cuatro van `private`. La clase lleva un constructor vacío, uno con los cuatro datos (en ese orden), y getter y setter de cada atributo.

### 1.4 · El controlador

En el paquete `controller`, crea `PlanController.java`, con `@RestController` y `@RequestMapping("/api/planes")`. Guarda una lista con estos tres planes:

| id | nombre | duracionMeses | precio |
|---|---|---|---|
| 1 | Plan mensual | 1 | 120000 |
| 2 | Plan trimestral | 3 | 330000 |
| 3 | Plan anual | 12 | 1200000 |

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/api/planes` | Responde la lista |
| `GET` | `/api/planes/{id}` | Responde el plan con ese `id` |
| `POST` | `/api/planes` | Recibe un plan en JSON, le asigna el siguiente `id` y lo responde |

**El `id` lo decide el servidor:** si alguien envía `"id": 99`, tu API lo ignora y asigna el siguiente número.

### ✅ Checklist de la fase 1

- [ ] El proyecto arranca y la consola dice `Tomcat started on port 8080`.
- [ ] En Postman, `GET http://localhost:8080/api/planes` muestra los 3 planes.
- [ ] `POST` con `{ "nombre": "Plan semestral", "duracionMeses": 6, "precio": 630000 }` responde el plan con `id` 4.
- [ ] `npm test` muestra los ejercicios 01 y 02 en ✅ (nota **1.4**).

---

## Fase 2 · Capas (como la sesión 2)

Reorganiza lo de la fase 1 en tres capas. La API debe responder **igual** que antes.

| Clase | Paquete | Qué hace |
|---|---|---|
| `PlanRepository` (interfaz) | `repository` | Declara `buscarTodos()`, `buscarPorId(Long)` y `guardar(Plan)` |
| `PlanRepositoryEnMemoria` | `repository` | `@Repository`. Implementa la interfaz con la lista de los 3 planes y un contador `siguienteId` que empieza en 4 |
| `PlanService` | `service` | `@Service`. Recibe un `PlanRepository` **por su constructor** |
| `PlanController` | `controller` | Recibe un `PlanService` **por su constructor**. Ya no tiene la lista |

### ✅ Checklist de la fase 2

- [ ] `PlanController` ya no tiene `new ArrayList` ni ningún `new` de servicios o repositorios.
- [ ] `buscarPorId` del repositorio devuelve `Optional<Plan>`.
- [ ] El servicio pone `setId(null)` antes de guardar un plan nuevo.
- [ ] Postman responde exactamente lo mismo que en la fase 1.
- [ ] `npm test` muestra el ejercicio 03 en ✅ (nota **1.9**).

---

## Fase 3 · JPA y PostgreSQL (como la sesión 3)

Ahora los planes se guardan en PostgreSQL y sobreviven a los reinicios. Sigue la guía de la sesión 3: es el mismo cambio que hicimos en Café Origen.

### 3.1 · Las dependencias

En `pom.xml`, dentro de `<dependencies>`, después de `spring-boot-starter-webmvc`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

Recarga Maven (ícono **m** con flechas).

### 3.2 · La base de datos

En pgAdmin: clic derecho sobre **Databases** → **Create → Database…** → `cuerpo_activo` → **Save**.

### 3.3 · La conexión

En `src/main/resources/application.properties`, debajo de `spring.application.name`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cuerpo_activo
spring.datasource.username=postgres
spring.datasource.password=TU-CONTRASEÑA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Cambia `TU-CONTRASEÑA` por la de **tu** PostgreSQL. `ddl-auto` debe ser `update`: con `create` se borran los datos en cada arranque.

### 3.4 · Los cambios en el código

| Archivo | Cambio |
|---|---|
| `Plan.java` | `@Entity` sobre la clase; `@Id` y `@GeneratedValue(strategy = GenerationType.IDENTITY)` sobre `id` |
| `PlanRepository.java` | Queda así: `public interface PlanRepository extends JpaRepository<Plan, Long> { }` |
| `PlanRepositoryEnMemoria.java` | **Bórralo** |
| `PlanService.java` | `buscarTodos()` → `findAll()`, `buscarPorId(id)` → `findById(id)`, `guardar(nuevo)` → `save(nuevo)` |
| `PlanController.java` | **No cambia** |

### 3.5 · Los planes iniciales

La tabla `plan` empieza vacía. En pgAdmin: clic derecho sobre `cuerpo_activo` → **Query Tool** → pega esto → ▶ **Execute**:

```sql
INSERT INTO plan (nombre, duracion_meses, precio) VALUES
('Plan mensual', 1, 120000),
('Plan trimestral', 3, 330000),
('Plan anual', 12, 1200000);
```

La columna se llama `duracion_meses`: Hibernate convierte `duracionMeses` a minúsculas con guion bajo. **No escribas el `id`**: lo genera PostgreSQL.

### ✅ Checklist de la fase 3

- [ ] Al arrancar, la consola muestra `Hibernate: create table plan (...)` (solo la primera vez).
- [ ] En pgAdmin aparece la tabla `plan` (clic derecho en **Tables** → **Refresh**).
- [ ] `POST` crea un plan, **detienes** la app, la vuelves a arrancar y `GET /api/planes` lo sigue mostrando.
- [ ] `npm test` muestra los ejercicios 01 a 04 en ✅ (nota **2.8**).

---

## Fase 4 · CRUD completo y Swagger (como la sesión 4)

La API ya guarda planes. Ahora debe **decir la verdad** con sus códigos, actualizar, retirar planes y tener su manual.

### 4.1 · Los códigos de respuesta

En `PlanController.java`, los métodos devuelven `ResponseEntity<...>`, como `ProductoController` en clase:

| Petición | Si sale bien | Si no existe |
|---|---|---|
| `GET /api/planes/{id}` | `200` con el plan | `404` (`ResponseEntity.notFound().build()`) |
| `POST /api/planes` | `201` con el plan creado (`ResponseEntity.status(HttpStatus.CREATED).body(...)`) | — |
| `PUT /api/planes/{id}` | `200` con el plan actualizado | `404` |
| `DELETE /api/planes/{id}` | `204` sin cuerpo (`ResponseEntity.noContent().build()`) | `404` |

`GET /api/planes` (la lista) no cambia.

### 4.2 · El servicio

En `PlanService.java`, agrega dos métodos:

| Método | Qué hace |
|---|---|
| `Optional<Plan> actualizar(Long id, Plan cambios)` | Busca el plan con `findById`. Si no existe, `Optional.empty()`. Si existe, copia `nombre`, `duracionMeses` y `precio`, y lo guarda con `save` |
| `boolean eliminar(Long id)` | Si `existsById(id)` es falso, devuelve `false`. Si existe, `deleteById(id)` y devuelve `true` |

### 4.3 · Swagger

En `pom.xml`, dentro de `<dependencies>`, después de `postgresql`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>3.2.0</version>
</dependency>
```

Recarga Maven, arranca y abre `http://localhost:8080/swagger-ui.html`. Ahí están tus cinco operaciones, con el botón **Try it out**.

### ✅ Checklist de la fase 4

- [ ] `GET /api/planes/999` responde `404`.
- [ ] `POST` responde `201`.
- [ ] `PUT /api/planes/1` con `{ "nombre": "Plan mensual", "duracionMeses": 1, "precio": 125000 }` responde `200`, y pgAdmin muestra el precio nuevo.
- [ ] `DELETE` de un plan recién creado responde `204`; el mismo `DELETE` otra vez responde `404`.
- [ ] Swagger UI abre en el navegador.
- [ ] `npm test` muestra los ejercicios 01 a 06 en ✅ (nota **4.0**).

---

## Fase 5 · Socios y DTO (como la sesión 4)

El gimnasio necesita inscribir **socios**, y cada socio tiene **un** plan. Después de la relación, la API deja de enviar entidades: todo sale y entra en **records**.

### 5.1 · La entidad `Socio`

En el paquete `model`, crea `Socio.java`: una `@Entity` con `id` (con `@Id` y `@GeneratedValue`, como `Plan`), `nombre` y su plan:

```java
@ManyToOne
@JoinColumn(name = "plan_id")
private Plan plan;
```

Con sus getters y setters. En el paquete `repository`, crea `SocioRepository extends JpaRepository<Socio, Long>`.

### 5.2 · La lista de socios en `Plan`

En `Plan.java`, el otro lado de la relación (import de `jakarta.persistence.OneToMany`, `java.util.List` y `java.util.ArrayList`):

```java
@OneToMany(mappedBy = "plan")
private List<Socio> socios = new ArrayList<>();
```

Con su getter y su setter. Al arrancar, la consola muestra `create table socio` y la llave foránea `plan_id`.

### 5.3 · Los records

Crea el paquete `dto` con cuatro **records**, como en Café Origen:

| Record | Componentes | Su método |
|---|---|---|
| `PlanRequest` | `String nombre, int duracionMeses, int precio` (**sin `id`**) | `Plan aEntidad()` |
| `PlanResponse` | `Long id, String nombre, int duracionMeses, int precio` | `static PlanResponse desde(Plan plan)` |
| `SocioRequest` | `String nombre, Long planId` | `Socio aEntidad(Plan plan)` |
| `SocioResponse` | `Long id, String nombre, String plan` (el **nombre** del plan) | `static SocioResponse desde(Socio socio)` |

### 5.4 · Los servicios y los controladores

| Archivo | Cambio |
|---|---|
| `PlanService.java` | `crear` y `actualizar` reciben un `PlanRequest` en vez de un `Plan` |
| `PlanController.java` | Recibe `PlanRequest` y devuelve `PlanResponse` (o `List<PlanResponse>`). **Ningún método devuelve `Plan`** |
| `SocioService.java` (nuevo, `service`) | Recibe `SocioRepository` y `PlanRepository` por su constructor. `listar()`, `buscarPorId(id)` y `Optional<Socio> crear(SocioRequest)`: si el plan no existe, `Optional.empty()` |
| `SocioController.java` (nuevo, `controller`) | `@RequestMapping("/api/socios")`: `GET` (lista), `GET /{id}` (`200` o `404`) y `POST` (`201`, o `400` si el plan no existe). Devuelve `SocioResponse` |

### 5.5 · Pruébalo en Postman

```text
POST http://localhost:8080/api/socios   { "nombre": "Valentina Rojas", "planId": 1 }
→ 201 · { "id": 1, "nombre": "Valentina Rojas", "plan": "Plan mensual" }

POST http://localhost:8080/api/socios   { "nombre": "Sin plan", "planId": 999 }
→ 400
```

Después de inscribir socios, `GET /api/planes` debe seguir mostrando una lista **corta y completa**. Si sale un JSON largo y cortado, estás devolviendo la entidad `Plan`: es el bucle que vimos en clase.

### ✅ Checklist de la fase 5

- [ ] pgAdmin muestra la tabla `socio` con la columna `plan_id`.
- [ ] `POST /api/socios` responde `201` con el **nombre** del plan.
- [ ] `POST /api/socios` con un plan que no existe responde `400`.
- [ ] `GET /api/planes` y `GET /api/socios` responden JSON corto, sin bucle.
- [ ] `npm test` muestra los 7 ejercicios en ✅ (nota **5.0**).

> **Ojo con `DELETE`:** si borras un plan que tiene socios, PostgreSQL lo impide (la llave foránea) y la API responde `500`. Prueba `DELETE` con un plan sin socios.

---

## Probar tu nota en tu computador

### Todos los ejercicios

En la terminal, dentro de `Lab_SpringBoot_CH15`:

```bash
npm test
```

La primera vez tarda más: Maven compila tu proyecto. Después, cada ejercicio arranca tu API en un puerto libre y le hace peticiones. Puedes dejar tu app corriendo en IntelliJ: los tests usan otro puerto.

**En la fase 3**, PostgreSQL debe estar encendido: los tests usan tu base `cuerpo_activo` y crean algunos planes de prueba (con un número al final del nombre).

### Un solo ejercicio

```bash
npm test -- 04
```

### Cómo se lee el resultado

| Símbolo | Significa |
|---|---|
| ✅ | Todos los tests de ese ejercicio pasan |
| 🟡 | Algunos pasan |
| ❌ | Ninguno pasa todavía |

Debajo de cada 🟡 o ❌ aparece qué test falló y una pista (→). Al final ves tu nota.

---

## Subir tus cambios

Desde la carpeta `Lab_SpringBoot_CH15`:

```bash
git add .
git commit -m "Fase 1: API de planes"
git push
```

Piensa en una caja que vas a enviar:

- `git add .` → metes los archivos en la caja.
- `git commit -m "..."` → cierras la caja y le pones una etiqueta.
- `git push` → envías la caja a tu fork en GitHub.

Haz un `commit` y un `push` al terminar **cada fase**: así, si algo se daña, tienes la fase anterior guardada.

---

## Pull Request (solo UNO)

### ¿Qué es un Pull Request?

**Definición técnica:** un Pull Request (PR) es una solicitud para que los cambios de tu fork se revisen en el repositorio original.

**En la vida real:** es como radicar un documento: lo entregas una vez y queda un número de radicado para hacerle seguimiento.

### Cómo abrirlo

1. Entra a tu fork en GitHub.
2. Clic en **Contribute → Open pull request**.
3. Revisa que arriba diga: repositorio de la profe ← tu fork.
4. **Título: tu nombre completo.**
5. Clic en **Create pull request**.

Ábrelo al terminar la fase 1. Las fases 2 y 3 las subes con `git push` y se suman solas al mismo PR. No abras otro.

---

## Ver tu nota

En unos minutos aparece en tu PR un comentario con tu nota y una tabla por ejercicio, y una etiqueta como `Nota 4.0`.
En el comentario, **🔎 Ver qué falta por corregir** muestra cada test que falló con su pista.

El robot usa **su propia** base PostgreSQL: no necesita tu contraseña ni tus datos.

### Ojo con la fecha límite

Este taller **no tiene fecha límite** por ahora. Si la profe pone una, después de esa fecha los `push` ya no cambian la nota.

---

## Archivos que NO debes modificar

- La carpeta `tests/`
- La carpeta `scripts/`
- La carpeta `.github/`
- El archivo `package.json`

Si los modificas, tu nota se calcula igual con los tests originales, pero tu PR queda marcado con `⚠️ Revisar`.

---

## Errores frecuentes

### «npm no se reconoce como un comando»

Instala Node.js (versión LTS) desde nodejs.org y **cierra y vuelve a abrir** la terminal.

### En IntelliJ sale «Full classname legend»

Maven está en *Use Maven wrapper*. Cámbialo a **Bundled (Maven 3)** (sección "Antes de empezar") y recarga Maven.

### «No encuentro la carpeta cuerpo-activo-api» o «quedó dentro de otra carpeta»

Revisa el árbol de la fase 1: la carpeta se llama exactamente `cuerpo-activo-api`, está al lado de `tests/` y tiene el `pom.xml` adentro.

### «Tu proyecto es Gradle»

En el Initializr quedó marcado **Gradle**. Vuelve a generarlo con **Maven**.

### «Maven no encuentra Java» o «Tu Java es más viejo que el que pide el pom.xml»

`java -version` debe decir 25. Si no, reinstala el JDK 25 de Adoptium con **Set JAVA_HOME variable** activado y reinicia la terminal.

### «Tu proyecto no compila (archivo, línea N): …»

El mensaje dice el archivo, la línea y la causa. IntelliJ también la marca en rojo. Mientras no compile, fallan todos los tests que arrancan la API.

### «no encuentro «buscarTodos»: con JpaRepository ese método se llama findAll»

En la fase 3 cambian los nombres: `findAll`, `findById` y `save`.

### «PlanRepositoryEnMemoria … esta clase ya no hace falta»

En la fase 3, bórrala: el repositorio lo escribe Spring Data JPA.

### «La app no arrancó: PostgreSQL rechazó la contraseña…»

Revisa `spring.datasource.password`: es la contraseña de **tu** PostgreSQL.

### «La app no arrancó: la base de datos cuerpo_activo no existe»

Créala en pgAdmin (paso 3.2). Hibernate crea tablas, no bases.

### «La app no arrancó: PostgreSQL no responde en ese puerto»

El servicio de PostgreSQL está apagado. En Windows: **Servicios** → `postgresql-x64-...` → **Iniciar**.

### «La app no arrancó: la entidad Plan no tiene @Id»

Falta `@Id` sobre `private Long id;`.

### «Después de reiniciar, … ya no encuentra el plan»

Tus datos siguen en memoria (¿terminaste la fase 3?) o `ddl-auto` está en `create`. Debe ser `update`.

### «duplicate key value violates unique constraint»

Insertaste filas escribiendo el `id` a mano. Borra esas filas e inserta sin `id`.

### «GET /api/planes trae un JSON cortado» o «no trae un JSON válido»

Es el bucle: `Plan` tiene sus socios y cada `Socio` tiene su plan. El controlador debe devolver `PlanResponse` y `SocioResponse`, no las entidades (fase 5).

### «PlanController.java todavía devuelve la entidad Plan»

Cambia el tipo de retorno de cada método a `PlanResponse` (o `List<PlanResponse>`, o `ResponseEntity<PlanResponse>`) y convierte con `PlanResponse.desde(plan)`.

### «La app no arrancó: … is 'mappedBy' a property named … which does not exist»

El texto de `mappedBy` debe ser **igual** al nombre del atributo en `Socio`: `mappedBy = "plan"` porque en `Socio` es `private Plan plan;`.

### «POST /api/socios … respondió 500»

Revisa que el cuerpo traiga `planId`. Sin él, `findById(null)` falla con `The given id must not be null`.

### «Please tell me who you are»

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

### Error 403 al hacer `git push`

Clonaste el repositorio de la profe en vez de tu fork. Vuelve al Paso 2 y clona la URL de **tu** fork.

---

<sub>© 2026 Ana Alvarado · Educadora Tech & Desarrolladora Full Stack · Todos los derechos reservados · linkedin.com/in/ana-alvarado-instructora-full-stack</sub>
