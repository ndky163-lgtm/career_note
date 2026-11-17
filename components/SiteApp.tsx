"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { EMPTY_FILTERS, getAdvisor, type Advisor, type Filters } from "@/lib/advisors";
import { parseRoute, routeToUrl, type NavFn, type Route } from "@/lib/nav";
import { SITE_TITLE } from "@/lib/site";
import { ConsultModal } from "./ConsultModal";
import { DetailView } from "./DetailView";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ListView } from "./ListView";
import { TopView } from "./TopView";

const INSTANT = "instant" as ScrollBehavior;

function scrollToId(id: string, attempt = 0) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else if (attempt < 5) window.setTimeout(() => scrollToId(id, attempt + 1), 60);
}

/**
 * Single-page shell: TOP / list / detail are switched client-side (no reload)
 * and mirrored into the URL with the History API.
 */
export default function SiteApp() {
  const [route, setRoute] = useState<Route>({ view: "top" });
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [consultFor, setConsultFor] = useState<Advisor | null>(null);

  const routeRef = useRef<Route>(route);
  const pendingScroll = useRef<string | null>(null);
  const firstLayout = useRef(true);

  const applyRoute = useCallback((next: Route) => {
    routeRef.current = next;
    setRoute(next);
  }, []);

  const go = useCallback(
    (next: Route, scrollTo?: string) => {
      const cur = routeRef.current;
      if (next.view === "top" && cur.view === "top") {
        // Already on TOP: just glide, don't remount (keeps lines drawn and the hero running).
        if (scrollTo) scrollToId(scrollTo);
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      window.history.pushState(null, "", routeToUrl(next));
      pendingScroll.current = scrollTo ?? null;
      applyRoute(next);
    },
    [applyRoute],
  );

  const onNav: NavFn = useCallback((view, scrollTo) => go({ view }, scrollTo), [go]);
  const openAdvisor = useCallback((a: Advisor) => go({ view: "detail", id: a.id }), [go]);

  const onSearch = useCallback(
    (theme: string, keyword: string) => {
      setFilters({ ...EMPTY_FILTERS, theme, keyword });
      go({ view: "list" });
    },
    [go],
  );

  // Deep links + browser back/forward.
  useEffect(() => {
    const initial = parseRoute(window.location.search);
    if (initial.view !== "top") applyRoute(initial);
    const onPop = () => {
      pendingScroll.current = null;
      applyRoute(parseRoute(window.location.search));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyRoute]);

  // After every view switch: jump to the top, then optionally glide to a section.
  useLayoutEffect(() => {
    if (firstLayout.current) {
      firstLayout.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: INSTANT });
    const target = pendingScroll.current;
    pendingScroll.current = null;
    if (target) {
      const t = window.setTimeout(() => scrollToId(target), 60);
      return () => window.clearTimeout(t);
    }
  }, [route]);

  const advisor = route.view === "detail" ? getAdvisor(route.id) : undefined;

  useEffect(() => {
    document.title = advisor ? `${advisor.name}｜${SITE_TITLE}` : SITE_TITLE;
  }, [advisor]);

  const closeModal = useCallback(() => setConsultFor(null), []);

  return (
    <>
      <Header onNav={onNav} />
      <main>
        {route.view === "list" && (
          <ListView filters={filters} onChange={setFilters} onOpenAdvisor={openAdvisor} />
        )}
        {route.view === "detail" && advisor && (
          <DetailView
            key={advisor.id}
            advisor={advisor}
            onNav={onNav}
            onOpenAdvisor={openAdvisor}
            onConsult={setConsultFor}
          />
        )}
        {(route.view === "top" || (route.view === "detail" && !advisor)) && (
          <TopView onNav={onNav} onOpenAdvisor={openAdvisor} onSearch={onSearch} />
        )}
      </main>
      <Footer onNav={onNav} />
      {consultFor && <ConsultModal advisor={consultFor} onClose={closeModal} />}
    </>
  );
}
