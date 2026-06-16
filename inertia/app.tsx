import '../resources/css/app.css'
import { type ReactElement } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import DashboardLayout from '~/layouts/dashboard'
import DashboardBuyerLayout from '~/layouts/dashboard-buyer'
import DashboardAdminLayout from '~/layouts/dashboard-admin'
import { type Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    const Wrapper = name.startsWith('admin/')
      ? DashboardAdminLayout
      : name.startsWith('dashboard/buyer/')
      ? DashboardBuyerLayout
      : name.startsWith('dashboard/')
      ? DashboardLayout
      : Layout
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) => <Wrapper children={page} />
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
