import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // An empty 'unload' listener is enough to stop most browsers from
    // storing this page in the back-forward cache (bfcache). Without this,
    // logging out and then pressing the browser Back button can show a
    // frozen, already-rendered snapshot of this protected page -- React
    // never re-runs, so the isAuthenticated check above never re-fires.
    const blockBfcache = () => {};
    window.addEventListener("unload", blockBfcache);

    // Belt-and-braces: if a browser bfcaches this page anyway, 'pageshow'
    // fires with persisted === true on restore. We re-check auth directly
    // from localStorage (synchronous, works even before Redux rehydrates)
    // and force a hard redirect that bypasses the stale cached render.
    const handlePageShow = (event) => {
      if (event.persisted && !localStorage.getItem("token")) {
        window.location.replace("/login");
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("unload", blockBfcache);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}