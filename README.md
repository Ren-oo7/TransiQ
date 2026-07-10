# TransiQ sitio web comercial

Base inicial del nuevo proyecto web para captacion y venta alrededor de TransiQ.

## Stack

- Next.js 16
- React 19
- TypeScript
- App Router
- SQLite local con `node:sqlite`

## Rutas iniciales

- `/`
- `/diagnostico`
- `/soluciones`
- `/soluciones/[slug]`
- `/recursos`
- `/demo`
- `/contacto`
- `/login`
- `/crm/login`
- `/crm`

## Ejecutar en local

```bash
npm.cmd install
npm.cmd run dev
```

Abrir en navegador:

- `http://localhost:3000`

## App externa y CRM comercial

La web comercial queda separada de la app operativa TransiQ:

- `/login`: acceso publico a la app TransiQ o puente temporal mientras se configura la URL real
- `/crm/login`: acceso interno del equipo comercial
- `/crm`: CRM comercial del sitio para gestionar leads captados

Si defines `TRANSIQ_APP_LOGIN_URL`, el boton `Acceso TransiQ` del header y la ruta `/login` deben apuntar a ese login real.

## CRM interno y acceso

El CRM interno usa:

- cookie de sesion firmada
- usuarios persistidos en SQLite
- roles `Director` y `Comercial`
- leads persistidos en SQLite

La base local vive en `.data/transiq-crm.db`.
Si existia `.data/leads.json`, el sistema migra esos leads al primer arranque de la base.

En desarrollo local, si no configuras variables de entorno, se habilita un seed demo con estas credenciales:

- `director@transiq.local` / `TransiQ2026!`
- `comercial@transiq.local` / `TransiQ2026!`

En hosting o produccion debes configurar estas variables tomando como base [`.env.example`](C:\xampp\htdocs\TransiQ_ISOsolutions\07_sitio_web_nextjs\.env.example:1):

- `TRANSIQ_ADMIN_SECRET`
- `TRANSIQ_APP_LOGIN_URL`
- `TRANSIQ_DIRECTOR_EMAIL`
- `TRANSIQ_DIRECTOR_PASSWORD`
- `TRANSIQ_DIRECTOR_NAME`
- `TRANSIQ_COMERCIAL_EMAIL`
- `TRANSIQ_COMERCIAL_PASSWORD`
- `TRANSIQ_COMERCIAL_NAME`

## Permisos actuales por rol

- `Director`: puede reasignar responsables, mover oportunidades a cualquier etapa y cerrar leads.
- `Comercial`: puede actualizar etapas intermedias y notas internas, pero no reasignar responsable ni cerrar oportunidades.

## Alcance actual

Esta base ya incluye:

- landing comercial modular
- diagnostico publico de captacion
- CRM interno separado del front publico
- persistencia SQLite local para leads y usuarios

El siguiente paso recomendado es mover esta misma estructura a una base de datos del hosting o un servicio administrado para produccion.
