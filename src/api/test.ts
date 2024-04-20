import { http } from "@/utils/http";

export function getTest(data?: object) {
  return http.post({ url: "/test", data });
}
