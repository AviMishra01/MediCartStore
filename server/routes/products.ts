// routes/products.ts
import { Router } from "express";
import {
  findProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { requireAdmin } from "../middleware/auth";

export const productsRouter = Router();

/**
 * Public: List products with optional search, category, sort, pagination, featured
 */
productsRouter.get("/", async (req, res) => {
  try {
    const { search = "", category = "", sort = "pop", limit, page, featured } = req.query as Record<string, string>;

    const limitNum = limit ? Number(limit) : 20;
    const pageNum = page ? Number(page) : 1;
    const featuredBool =
      featured === "true" || featured === "1" ? true : undefined;

    const [list, categories] = await Promise.all([
      findProducts({
        search,
        category,
        sort,
        limit: limitNum,
        page: pageNum,
        featured: featuredBool,
      }),
      getCategories(),
    ]);

    // Return items, total count, pages, and categories
    res.json({
      items: list.items,
      total: list.total,
      page: list.page,
      pages: list.pages,
      categories,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      message: "Server error fetching products",
      ...(process.env.NODE_ENV !== "production" ? { stack: (err as any)?.stack } : {}),
    });
  }
});

/**
 * Public: Get single product by ID
 */
productsRouter.get("/:id", async (req, res) => {
  try {
    const item = await getProductById(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({
      message: "Server error fetching product",
      ...(process.env.NODE_ENV !== "production" ? { stack: (err as any)?.stack } : {}),
    });
  }
});

/**
 * Admin: Create new product
 */
productsRouter.post("/", requireAdmin, async (req, res) => {
  try {
    const created = await createProduct(req.body);
    res.json(created);
  } catch (err) {
    console.error("Admin create product error:", err);
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error"
          : (err as any)?.message || String(err),
      ...(process.env.NODE_ENV === "production" ? {} : { stack: (err as any)?.stack }),
    });
  }
});

/**
 * Admin: Update existing product by ID
 */
productsRouter.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    console.error("Admin update product error:", err);
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error"
          : (err as any)?.message || String(err),
      ...(process.env.NODE_ENV === "production" ? {} : { stack: (err as any)?.stack }),
    });
  }
});

/**
 * Admin: Delete product by ID
 */
productsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const success = await deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ message: "Product not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Admin delete product error:", err);
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error"
          : (err as any)?.message || String(err),
      ...(process.env.NODE_ENV === "production" ? {} : { stack: (err as any)?.stack }),
    });
  }
});
