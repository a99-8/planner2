import { staticHeaders } from "@/constant/staticHeaders";

export function prossHeaders(selectedColumns: any) {
  const dynamicHeaders = selectedColumns.filter(
    (col: string) => !staticHeaders.includes(col),
  );

  const headers = [...staticHeaders, ...dynamicHeaders];
  return headers;
}
