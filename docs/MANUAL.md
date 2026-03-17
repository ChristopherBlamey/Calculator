# BLAMEY ERP - Manual de Usuario V1.3

## Introducción

BLAMEY ERP es un sistema de gestión integral para tu negocio de comida (carritos de completos, hamburguesas, etc.). Gestiona productos, ingredientes, logística, eventos y presupuestos.

---

## Estructura del Sistema

### Navegación

El sistema cuenta con un menú lateral (desktop) o menú desplegable (móvil):

1. **Dashboard** - Vista general de métricas y estadísticas
2. **Logística** - Cálculo de rutas y combustible con Google Maps
3. **Evento** - Gestión de eventos y ventas
4. **Productos** - Selección de productos para vender
5. **Resultados** - Cálculo de ingredientes necesarios
6. **Lista** - Lista de compras para eventos
7. **Finanzas** - Configuración de costos de ingredientes
8. **Recetas** - Editor de recetas
9. **Admin Prod.** - Administración de productos e ingredientes

---

## Módulos Detallados

### 1. Dashboard

Muestra métricas clave de tu negocio:
- Ganancia Neta Total
- Margen Neto Promedio
- Gasto Logístico Total
- Gráficos de Rentabilidad Operativa
- Tendencias de Productos Más Vendidos
- Logística vs Producción

### 2. Logística

Calcula el costo de combustible para tus eventos:

1. Ingresa la dirección de destino (autocompletado con Google Maps)
2. Configura el rendimiento de tu vehículo (km/L)
3. Configura el precio de la bencina ($/litro)
4. Click en "Calcular Ruta"
5. Guarda el costo en el evento actual

**Nota:** Evita automáticamente peajes y autopistas.

### 3. Evento (Gestión de Ventas)

Ciclo de vida de un evento:

1. **Borrador**: Crea un nuevo evento
2. **Pendiente/En Curso**: Cuando agregas productos
3. **Finalizado**: Cuando guardas el evento

**Pasos:**
1. Ingresa el nombre del evento
2. Ingresa la fecha
3. Click en "Cargar Evento" para iniciar
4. Ve a "Productos" para agregar lo que venderás
5. Registra cada venta
6. Calcula la ruta en "Logística"
7. En "Evento": usa "Guardar Evento" o "Generar Presupuesto"

**Estados de Pago:**
- Pendiente (por defecto)
- Pagado (toggle en la UI)

### 4. Productos

Selección de productos para vender:

- Completo (Solo, Italiano, Dinámico, Completo)
- Hamburguesa (Simple, Italiana, Completa)
- Churrasco (Italiano, Completo)
- As (Italiano, Completo)

**Uso:**
1. Selecciona cantidad de cada producto
2. Click en "Calcular Ingredientes" para ver qué necesitas
3. Click en "Registrar Venta (Evento)" para agregar al evento

### 5. Resultados

Muestra los ingredientes necesarios según los productos seleccionados.

### 6. Lista de Compras

Genera y exporta listas:

- Copiar texto
- Descargar CSV
- Descargar PDF
- Enviar por WhatsApp a Chris o Fer

### 7. Finanzas (Costos)

Configura el precio de cada ingrediente:

1. Selecciona productos en "Productos"
2. Ve a "Finanzas"
3. Ingresa el costo por unidad de cada ingrediente
4. Se guarda automáticamente

### 8. Admin Productos

Gestión completa de productos e ingredientes:

**Ingredientes:**
- Ver todos los ingredientes
- Agregar nuevos ingredientes
- Editar nombre, unidad, costo
- Eliminar ingredientes

**Productos:**
- Ver productos existentes
- Crear productos personalizados (empanadas, bebidas, etc.)
- Asignar ingredientes con cantidades
- Editar precio de venta
- Sincronizar con recetas base
- Conversión automática kg → grams

**Unidades:**
- unit (unidades)
- grams (gramos)
- lt (litros)

---

## Supabase (Base de Datos)

Tablas principales:

1. **ingredientes**: Inventario base
2. **productos**: Menú con ingredientes
3. **eventos**: Registro de ventas

---

## Atajos de Teclado

- Navegación por tabs
- Enter para confirmar

---

## Recomendaciones

1. **Antes de cada evento:**
   - Configura precios en "Finanzas"
   - Crea el evento en "Evento"
   - Agrega los productos en "Productos"
   - Calcula la ruta en "Logística"

2. **Precios:**
   - Los precios de venta se configuran en Admin Productos
   - Los costos de ingredientes van en Finanzas

3. **Presupuestos:**
   - Solo muestran precios de venta, NO costos internos
   - Formato profesional para enviar a clientes

---

## Troubleshooting

### No aparecen productos en Admin
- Click en "Sincronizar" para cargar recetas base

### Error al sincronizar
- Verifica que la tabla "productos" tenga las columnas type y variant

### Los gramos no cuadran
- El sistema convierte kg a grams automáticamente (ej: 0.5 kg = 500 g)

---

## Contacto

BLAMEY ERP © 2026
Versión: 1.3
