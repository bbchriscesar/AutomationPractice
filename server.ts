import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes for Hybrid Testing ---

  // Mock Database
  let cart: any[] = [];
  const products = [
    { id: "p1", name: "Quantum Processor", price: 299.99, category: "Hardware", stock: 15 },
    { id: "p2", name: "Neural Link Cable", price: 49.50, category: "Accessories", stock: 50 },
    { id: "p3", name: "Holographic Display", price: 899.00, category: "Visuals", stock: 5 },
    { id: "p4", name: "Cybernetic Mouse", price: 120.00, category: "Peripherals", stock: 25 },
    { id: "p5", name: "Bio-Metric Keyboard", price: 250.00, category: "Peripherals", stock: 10 },
  ];

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "password123") {
      res.json({ success: true, token: "mock-jwt-token-automation-123", user: { name: "Test Engineer" } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Products API
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  // Cart API
  app.get("/api/cart", (req, res) => {
    res.json(cart);
  });

  app.post("/api/cart/add", (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    res.json({ success: true, cart });
  });

  app.delete("/api/cart/clear", (req, res) => {
    cart = [];
    res.json({ success: true, message: "Cart cleared" });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Automation Practice Server running on http://localhost:${PORT}`);
  });
}

startServer();
