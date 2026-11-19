# Festival Cultural 2026

Aplicación web responsive para la venta de entradas del Festival Cultural 2026.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion

```bash
npm install
```

## Configuracion

Copia el archivo de ejemplo y configura la URL del Google Apps Script:

```bash
cp .env.example .env
```

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/REEMPLAZAR/exec
```

## Desarrollo

```bash
npm run dev
```

Abre la direccion mostrada por Vite, normalmente `http://localhost:5173`.

## Produccion

```bash
npm run build
npm run preview
```

La aplicacion puede desplegarse directamente en Vercel. Configura `VITE_GOOGLE_SCRIPT_URL` como variable de entorno en el proyecto de Vercel.

## Imagenes del carrusel

Las imagenes actuales se cargan desde Unsplash. Para usar imagenes propias, crea `public/images/` y modifica el arreglo `slides` en `src/components/Hero.tsx`.

Se recomienda usar archivos `.webp` horizontales de aproximadamente `1920 x 1080 px`.
