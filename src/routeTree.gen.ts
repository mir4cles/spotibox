// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const LibraryLazyImport = createFileRoute('/library')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const LibraryLazyRoute = LibraryLazyImport.update({
  path: '/library',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/library.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/library': {
      preLoaderRoute: typeof LibraryLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  LibraryLazyRoute,
])
