# API Documentation

## Base URL
```
http://localhost:5173/api
```

## Endpoints

### Clientes

#### Listar todos los clientes
```bash
curl http://localhost:5173/api/clientes
```

#### Obtener un cliente específico
```bash
curl http://localhost:5173/api/clientes/1001
```

#### Crear un nuevo cliente
```bash
curl -X POST http://localhost:5173/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1004",
    "nombre": "Nuevo Cliente",
    "telefono": "555-0000",
    "email": "nuevo@ejemplo.com",
    "direccion": "Calle Nueva 123",
    "numeroCliente": "C1004",
    "fechaRegistro": "2024-03-15",
    "planActual": "Fibra 100MB",
    "estado": "activo"
  }'
```

#### Actualizar un cliente
```bash
curl -X PUT http://localhost:5173/api/clientes/1001 \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "555-1111",
    "email": "actualizado@ejemplo.com"
  }'
```

#### Eliminar un cliente
```bash
curl -X DELETE http://localhost:5173/api/clientes/1001
```

### Tickets

#### Listar todos los tickets
```bash
curl http://localhost:5173/api/tickets
```

#### Obtener un ticket específico
```bash
curl http://localhost:5173/api/tickets/T1001
```

#### Crear un nuevo ticket
```bash
curl -X POST http://localhost:5173/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "id": "T1004",
    "clienteId": "1001",
    "estado": "abierto",
    "departamento": "tecnico",
    "problema": "Nuevo problema reportado",
    "notas": [],
    "fechaCreacion": "2024-03-15T10:00:00Z",
    "fechaActualizacion": "2024-03-15T10:00:00Z"
  }'
```

#### Actualizar un ticket
```bash
curl -X PUT http://localhost:5173/api/tickets/T1001 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "resuelto",
    "notas": ["Problema resuelto"]
  }'
```

#### Eliminar un ticket
```bash
curl -X DELETE http://localhost:5173/api/tickets/T1001
```

## Códigos de Estado

- 200: Éxito
- 404: No encontrado
- 500: Error interno del servidor

## Formato de Respuesta

Todas las respuestas son en formato JSON.

### Ejemplo de respuesta exitosa:
```json
{
  "id": "1001",
  "nombre": "Juan Pérez",
  "telefono": "555-123-4567",
  ...
}
```

### Ejemplo de respuesta de error:
```json
{
  "error": "Not found"
}
```