import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerOAuthRoutes } from "./_core/oauth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse request bodies
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Register OAuth routes
  registerOAuthRoutes(app);

  // Register tRPC router
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Serve static files from dist/public in production
  // We assume the server is running from the root or a 'dist' folder adjacent to 'public'
  // Trying common paths for Vercel/Production
  let staticPath = path.resolve(__dirname, "../dist");
  
  // If running from compiled server file in dist/
  if (__dirname.endsWith('dist-server')) {
     staticPath = path.resolve(__dirname, "../dist"); 
  } else {
     // Fallback/Local
     staticPath = path.resolve(__dirname, "../dist");
  }

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Don't serve index.html for api requests that missed the middleware
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
