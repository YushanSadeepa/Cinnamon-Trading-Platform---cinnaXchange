/**
 * noCache middleware
 * Prevents any API response from being cached by the browser or proxies.
 * Stops the "back button after logout shows protected page" vulnerability.
 *
 * Mount in server.js after express.json(), before routes:
 *   import noCache from "./middleware/noCache.js";
 *   app.use(noCache);
 */
export default function noCache(req, res, next) {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
}
