# CHANGELOG

## [1.1] - 2025-06-04

### Añadido
- Pruebas unitarias para rutas y servicios principales.
- Integración de flake8 y coverage para control de calidad y cobertura.
- Uso de variables de entorno con `.env` y `python-dotenv` para configuración segura.
- Makefile y/o batch para automatizar tareas comunes (tests, lint, coverage).
- Documentación mejorada en README y docstrings en servicios y rutas.

### Mejorado
- Refactorización de la arquitectura: separación clara en `services/`, `routes/`, `models/`, `utils/`.
- Limpieza de código muerto y eliminación de imports/funciones no usados.
- Mejor manejo de errores y validaciones en endpoints.
- Desacoplamiento de lógica repetida en utilidades (`utils/`).

### Corregido
- Problemas de importación en tests y estructura de carpetas.
- Errores de fechas en modelos y tests (uso correcto de objetos `date`).
- Eliminación en cascada de pagos al borrar deudas.

---

## [1.0] - 2025-05-XX

- Versión inicial del backend PayVue.
- CRUD de usuarios, ingresos, deudas y pagos.
- Autenticación básica.
- Estructura inicial de modelos y rutas.

---
