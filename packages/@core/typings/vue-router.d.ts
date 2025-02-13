import type { RouteMeta as IRouteMeta } from '@mubox-core/typings';

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta extends IRouteMeta {}
}
