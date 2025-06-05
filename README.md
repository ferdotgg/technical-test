# 🛍️ Products Hub

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

Dashboard moderno para gestión de productos con WebSockets y autenticación JWT.

## ✨ Características

- 🔐 **Autenticación** con DummyJSON API
- 📊 **Dashboard en tiempo real** con WebSockets
- 🔄 **Sincronización multi-pestaña** con BroadcastChannel
- 🎨 **UI moderna** con Tailwind CSS y shadcn/ui
- 🧪 **Tests unitarios** con Jest

## 🛠️ Stack

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Redux Toolkit** - Gestión de estado
- **Tailwind CSS** - Estilos utilitarios
- **shadcn/ui** - Componentes UI
- **WebSockets** - Comunicación en tiempo real

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

## 🔐 Credenciales de Prueba

```
Usuario: emilys
Contraseña: emilyspass
```

## 📝 Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run lint         # Linter
```

## 📁 Estructura

```
src/
├── app/           # Next.js App Router
├── components/    # Componentes reutilizables
├── hooks/         # Custom hooks
├── store/         # Redux store
├── types/         # TypeScript types
└── tests/         # Tests unitarios
```

## 🌐 APIs

- **Autenticación**: `https://dummyjson.com/auth/login`
- **Productos**: `https://dummyjson.com/products`
- **WebSocket**: `wss://echo.websocket.org`
