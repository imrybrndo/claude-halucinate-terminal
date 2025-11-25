export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  // Validate configuration and fail safely in development
  if (!oauthPortalUrl || !appId) {
    console.error(
      "[Auth] Missing VITE_OAUTH_PORTAL_URL or VITE_APP_ID; falling back to '/'"
    );
    return "/";
  }

  let base: URL;
  try {
    base = new URL(oauthPortalUrl);
  } catch {
    console.error("[Auth] Invalid VITE_OAUTH_PORTAL_URL:", oauthPortalUrl);
    return "/";
  }

  // Ensure /app-auth suffix
  base.pathname = base.pathname.replace(/\/?$/, "/app-auth");
  base.searchParams.set("appId", appId);
  base.searchParams.set("redirectUri", redirectUri);
  base.searchParams.set("state", state);
  base.searchParams.set("type", "signIn");

  return base.toString();
};