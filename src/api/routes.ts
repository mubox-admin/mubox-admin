import type { RouteRecordRaw } from "vue-router";
import { http } from "@/utils/http";

export const getAsyncRoutes = () => http.get<RouteRecordRaw[]>({ url: "/getAsyncRoutes" });
