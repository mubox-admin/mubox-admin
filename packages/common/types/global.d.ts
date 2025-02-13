import type { RouteMeta as IRouteMeta } from '@mubox-core/typings';

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta extends IRouteMeta {}
}

export interface MuboxAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
}

export interface ApplicationConfig {
  apiURL: string;
}

declare global {
  interface Window {
    _MUBOX_ADMIN_PRO_APP_CONF_: MuboxAdminProAppConfigRaw;
  }
}
