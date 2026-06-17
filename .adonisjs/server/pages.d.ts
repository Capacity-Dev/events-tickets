import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin/categories': ExtractProps<(typeof import('../../inertia/pages/admin/categories.tsx'))['default']>
    'admin/currencies': ExtractProps<(typeof import('../../inertia/pages/admin/currencies.tsx'))['default']>
    'admin/events_pending': ExtractProps<(typeof import('../../inertia/pages/admin/events_pending.tsx'))['default']>
    'admin/fee_rules': ExtractProps<(typeof import('../../inertia/pages/admin/fee_rules.tsx'))['default']>
    'admin/finances': ExtractProps<(typeof import('../../inertia/pages/admin/finances.tsx'))['default']>
    'admin/homepage': ExtractProps<(typeof import('../../inertia/pages/admin/homepage.tsx'))['default']>
    'admin/index': ExtractProps<(typeof import('../../inertia/pages/admin/index.tsx'))['default']>
    'admin/settings': ExtractProps<(typeof import('../../inertia/pages/admin/settings.tsx'))['default']>
    'admin/users': ExtractProps<(typeof import('../../inertia/pages/admin/users.tsx'))['default']>
    'admin/whatsapp': ExtractProps<(typeof import('../../inertia/pages/admin/whatsapp.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'checkout/cart': ExtractProps<(typeof import('../../inertia/pages/checkout/cart.tsx'))['default']>
    'checkout/checkout': ExtractProps<(typeof import('../../inertia/pages/checkout/checkout.tsx'))['default']>
    'dashboard/buyer/orders_show': ExtractProps<(typeof import('../../inertia/pages/dashboard/buyer/orders_show.tsx'))['default']>
    'dashboard/buyer/orders': ExtractProps<(typeof import('../../inertia/pages/dashboard/buyer/orders.tsx'))['default']>
    'dashboard/buyer/pay': ExtractProps<(typeof import('../../inertia/pages/dashboard/buyer/pay.tsx'))['default']>
    'dashboard/buyer/settings': ExtractProps<(typeof import('../../inertia/pages/dashboard/buyer/settings.tsx'))['default']>
    'dashboard/buyer/tickets': ExtractProps<(typeof import('../../inertia/pages/dashboard/buyer/tickets.tsx'))['default']>
    'dashboard/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/index.tsx'))['default']>
    'dashboard/organizer/analytics': ExtractProps<(typeof import('../../inertia/pages/dashboard/organizer/analytics.tsx'))['default']>
    'dashboard/organizer/check_in': ExtractProps<(typeof import('../../inertia/pages/dashboard/organizer/check_in.tsx'))['default']>
    'dashboard/organizer/clients': ExtractProps<(typeof import('../../inertia/pages/dashboard/organizer/clients.tsx'))['default']>
    'dashboard/organizer/events_create': ExtractProps<(typeof import('../../inertia/pages/dashboard/organizer/events_create.tsx'))['default']>
    'dashboard/organizer/events': ExtractProps<(typeof import('../../inertia/pages/dashboard/organizer/events.tsx'))['default']>
    'dashboard/organizer/payouts': ExtractProps<(typeof import('../../inertia/pages/dashboard/organizer/payouts.tsx'))['default']>
    'dashboard/settings': ExtractProps<(typeof import('../../inertia/pages/dashboard/settings.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
  }
}
