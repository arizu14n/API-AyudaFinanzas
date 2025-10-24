# Documentación de la API AyudaFinanzas

Este documento proporciona instrucciones sobre cómo usar la API de AyudaFinanzas.

## URL Base

La API está desplegada en Render y se puede acceder a través de la siguiente URL base:
`https://api-ayudafinanzas.onrender.com`

## Autenticación

La mayoría de los endpoints de esta API están protegidos y requieren un JSON Web Token (JWT) para la autenticación.

Para obtener un token, primero debes registrar un usuario y luego iniciar sesión. El token debe incluirse en la cabecera `Authorization` para todas las peticiones protegidas, utilizando el esquema `Bearer`.

**Ejemplo:** `Authorization: Bearer <tu_token_jwt>`

---

## Endpoints

### Usuarios

#### 1. Registrar un nuevo usuario
- **Método:** `POST`
- **Ruta:** `/api/usuarios/registrar`
- **Descripción:** Crea un nuevo usuario en el sistema.
- **Cuerpo de la Petición (`raw/json`):**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "tu_contraseña"
  }
  ```
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "message": "Usuario registrado exitosamente.",
    "userId": 1
  }
  ```
- **Respuestas de Error:**
  - `400 Bad Request`: Si el email o la contraseña no se proporcionan.
  - `409 Conflict`: Si el email ya está registrado.

#### 2. Iniciar sesión de usuario
- **Método:** `POST`
- **Ruta:** `/api/usuarios/login`
- **Descripción:** Autentica a un usuario y devuelve un JWT.
- **Cuerpo de la Petición (`raw/json`):**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "tu_contraseña"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Respuestas de Error:**
  - `400 Bad Request`: Si el email o la contraseña no se proporcionan.
  - `401 Unauthorized`: Si las credenciales son inválidas.

---

### Cheques

Todos los endpoints de cheques están protegidos y requieren autenticación.

#### 1. Crear un nuevo cheque
- **Método:** `POST`
- **Ruta:** `/api/cheques`
- **Descripción:** Crea un nuevo cheque asociado al usuario autenticado. La petición debe ser de tipo `multipart/form-data`.
- **Cabeceras:**
  - `Authorization: Bearer <tu_token_jwt>`
- **Cuerpo de la Petición (`form-data`):**
  - `nro` (texto)
  - `banco` (texto)
  - `librador` (texto)
  - `fecha_emision` (texto, formato `YYYY-MM-DD`)
  - `importe` (texto)
  - `estado` (texto)
  - `imagen` (archivo)
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "message": "Cheque registrado exitosamente.",
    "check": {
      "id": 1,
      "nro": "12345",
      "banco": "Banco Ejemplo",
      "librador": "Juan Perez",
      "fecha_emision": "2025-10-26T00:00:00.000Z",
      "importe": "1500.50",
      "imagen_url": "https://res.cloudinary.com/...",
      "estado": "Pendiente",
      "usuario_id": 1
    }
  }
  ```

#### 2. Obtener todos los cheques del usuario
- **Método:** `GET`
- **Ruta:** `/api/cheques`
- **Descripción:** Devuelve una lista de todos los cheques que pertenecen al usuario autenticado.
- **Cabeceras:**
  - `Authorization: Bearer <tu_token_jwt>`
- **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "id": 1,
      "nro": "12345",
      "banco": "Banco Ejemplo",
      // ...otros campos
    },
    {
      "id": 2,
      "nro": "67890",
      // ...otros campos
    }
  ]
  ```

#### 3. Actualizar un cheque
- **Método:** `PUT`
- **Ruta:** `/api/cheques/:id`
- **Descripción:** Actualiza los detalles de un cheque específico. Solo el dueño del cheque puede realizar esta acción.
- **Cabeceras:**
  - `Authorization: Bearer <tu_token_jwt>`
- **Parámetros de URL:**
  - `id`: El ID del cheque a actualizar.
- **Cuerpo de la Petición (`raw/json`):**
  ```json
  {
    "estado": "Cobrado",
    "importe": "1600.00"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Cheque actualizado exitosamente.",
    "check": {
      "id": 1,
      "estado": "Cobrado",
      "importe": "1600.00",
      // ...otros campos
    }
  }
  ```
- **Respuestas de Error:**
  - `403 Forbidden`: Si el usuario no es el dueño del cheque.
  - `404 Not Found`: Si el cheque con el ID dado no existe.

#### 4. Eliminar un cheque
- **Método:** `DELETE`
- **Ruta:** `/api/cheques/:id`
- **Descripción:** Elimina un cheque específico. Solo el dueño del cheque puede realizar esta acción.
- **Cabeceras:**
  - `Authorization: Bearer <tu_token_jwt>`
- **Parámetros de URL:**
  - `id`: El ID del cheque a eliminar.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Cheque eliminado exitosamente."
  }
  ```
- **Respuestas de Error:**
  - `403 Forbidden`: Si el usuario no es el dueño del cheque.
  - `404 Not Found`: Si el cheque con el ID dado no existe.
