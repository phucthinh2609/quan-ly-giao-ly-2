import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export interface RouteMatch {
  path: string;
  pattern: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  query: Record<string, string>;
}

export interface RouterContextType {
  pathname: string;
  search: string;
  fullPath: string;
  params: Record<string, string>;
  query: Record<string, string>;
  searchParams: URLSearchParams;
  navigate: (path: string, options?: { replace?: boolean; query?: Record<string, string | number | undefined> }) => void;
  setQueryParams: (query: Record<string, string | number | undefined>, options?: { replace?: boolean }) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

/**
 * Match a pattern like "/classes/:classId/attendance" with actual pathname "/classes/cls-7a/attendance"
 */
export function matchPath(pattern: string, pathname: string): { matches: boolean; params: Record<string, string> } {
  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const aSeg = pathSegments[i];

    if (pSeg.startsWith(":")) {
      const paramName = pSeg.slice(1);
      params[paramName] = decodeURIComponent(aSeg);
    } else if (pSeg.toLowerCase() !== aSeg.toLowerCase()) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

/**
 * Extract path params for common URL patterns defined in Sitemap §16
 */
const KNOWN_ROUTE_PATTERNS = [
  "/classes/:classId/attendance",
  "/classes/:classId/scores",
  "/classes/:classId/students",
  "/classes/:classId",
  "/students/:studentId",
  "/notifications/:notificationId",
  "/admin/classes/:classId",
  "/admin/students/:studentId",
  "/admin/users/:userId",
];

export function extractRouteParams(pathname: string): Record<string, string> {
  for (const pattern of KNOWN_ROUTE_PATTERNS) {
    const match = matchPath(pattern, pathname);
    if (match.matches) {
      return match.params;
    }
  }
  return {};
}

export function parseQueryString(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export const RouterProvider: React.FC<{
  children: React.ReactNode;
  initialPath?: string;
}> = ({ children, initialPath }) => {
  const getInitialUrl = (): { pathname: string; search: string } => {
    if (initialPath) {
      const [path, qs] = initialPath.split("?");
      return { pathname: path || "/", search: qs ? `?${qs}` : "" };
    }
    if (typeof window !== "undefined") {
      const p = window.location.pathname || "/";
      const s = window.location.search || "";
      return { pathname: p === "/" ? "/dashboard" : p, search: s };
    }
    return { pathname: "/dashboard", search: "" };
  };

  const [currentUrl, setCurrentUrl] = useState<{ pathname: string; search: string }>(getInitialUrl);

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname || "/";
      const s = window.location.search || "";
      setCurrentUrl({ pathname: p, search: s });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback(
    (
      targetPath: string,
      options?: { replace?: boolean; query?: Record<string, string | number | undefined> }
    ) => {
      let finalPath = targetPath;
      let finalSearch = "";

      if (targetPath.includes("?")) {
        const [pathPart, searchPart] = targetPath.split("?");
        finalPath = pathPart;
        finalSearch = `?${searchPart}`;
      }

      if (options?.query) {
        const sp = new URLSearchParams(finalSearch);
        Object.entries(options.query).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "") {
            sp.delete(k);
          } else {
            sp.set(k, String(v));
          }
        });
        const qs = sp.toString();
        finalSearch = qs ? `?${qs}` : "";
      }

      const fullUrl = `${finalPath}${finalSearch}`;

      if (typeof window !== "undefined" && window.history) {
        if (options?.replace) {
          window.history.replaceState({}, "", fullUrl);
        } else {
          window.history.pushState({}, "", fullUrl);
        }
      }

      setCurrentUrl({ pathname: finalPath, search: finalSearch });
    },
    []
  );

  const setQueryParams = useCallback(
    (
      query: Record<string, string | number | undefined>,
      options?: { replace?: boolean }
    ) => {
      const sp = new URLSearchParams(currentUrl.search);
      Object.entries(query).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") {
          sp.delete(k);
        } else {
          sp.set(k, String(v));
        }
      });
      const qs = sp.toString();
      const newSearch = qs ? `?${qs}` : "";
      const fullUrl = `${currentUrl.pathname}${newSearch}`;

      if (typeof window !== "undefined" && window.history) {
        if (options?.replace !== false) {
          window.history.replaceState({}, "", fullUrl);
        } else {
          window.history.pushState({}, "", fullUrl);
        }
      }

      setCurrentUrl({ pathname: currentUrl.pathname, search: newSearch });
    },
    [currentUrl]
  );

  const goBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  const searchParams = useMemo(() => new URLSearchParams(currentUrl.search), [currentUrl.search]);
  const query = useMemo(() => parseQueryString(currentUrl.search), [currentUrl.search]);
  const params = useMemo(() => extractRouteParams(currentUrl.pathname), [currentUrl.pathname]);
  const fullPath = `${currentUrl.pathname}${currentUrl.search}`;

  const value: RouterContextType = {
    pathname: currentUrl.pathname,
    search: currentUrl.search,
    fullPath,
    params,
    query,
    searchParams,
    navigate,
    setQueryParams,
    goBack,
  };

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}
