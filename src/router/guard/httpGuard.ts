import type { Router } from "vue-router";
import type { Nullable } from "@mubox/utils";
import projectSetting from "@/config/projectSetting";
import { AxiosCanceler } from "@/utils/http/axiosCancel";

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
export function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting;
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending)
    axiosCanceler = new AxiosCanceler();

  router.beforeEach(async () => {
    // Switching the route will delete the previous request
    axiosCanceler?.removeAllPending();
    return true;
  });
}
