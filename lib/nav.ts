export type Route =
  | { view: "top" }
  | { view: "list" }
  | { view: "detail"; id: number };

export type NavFn = (view: "top" | "list", scrollTo?: string) => void;

export function parseRoute(search: string): Route {
  const q = new URLSearchParams(search);
  const v = q.get("view");
  if (v === "list") return { view: "list" };
  if (v === "detail") {
    const id = Number(q.get("id"));
    if (Number.isInteger(id) && id > 0) return { view: "detail", id };
    return { view: "list" };
  }
  return { view: "top" };
}

export function routeToUrl(r: Route): string {
  if (r.view === "list") return "/?view=list";
  if (r.view === "detail") return `/?view=detail&id=${r.id}`;
  return "/";
}
