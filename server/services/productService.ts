import mongoose from "mongoose";
import { ProductModel, Product } from "../models/Product";
import { sampleProducts } from "../data/sample-products";

let inMemoryProducts: (Product & { _id: string })[] = [];
let nextId = 1;

export function isMongoConnected(): boolean {
  return mongoose.connection?.readyState === 1;
}

export async function ensureSeed(): Promise<void> {
  if (isMongoConnected()) {
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      await ProductModel.insertMany(sampleProducts);
    }
  } else if (inMemoryProducts.length === 0) {
    inMemoryProducts = sampleProducts.map((p, idx) => ({
      ...p,
      _id: String(idx + 1),
    })) as any;
    nextId = inMemoryProducts.length + 1;
  }
}

export async function findProducts(params: {
  search?: string;
  category?: string;
  sort?: string;
  limit?: number;
  page?: number;
  featured?: boolean;
}): Promise<{
  items: (Product & { _id: string })[];
  total: number;
  page: number;
  pages: number;
}> {
  const { search = "", category = "", sort = "pop", limit = 20, page = 1, featured } = params;

  if (isMongoConnected()) {
    const filter: any = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured;

    const sortMap: Record<string, any> = {
      pop: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      new: { createdAt: -1 },
    };
    const sortObj = sortMap[sort] ?? sortMap.pop;
    const total = await (ProductModel as any).countDocuments(filter);
    const items = (await (ProductModel as any)
      .find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()) as any;
    const pages = Math.max(1, Math.ceil(total / limit));
    return { items, total, page, pages };
  }

  let results = [...inMemoryProducts];
  if (search) {
    const s = search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  if (category) results = results.filter((p) => p.category === category);
  if (featured !== undefined) results = results.filter((p) => p.featured === featured);
  switch (sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "new":
    case "pop":
    default:
      break;
  }
  const total = results.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = results.slice(start, start + limit);
  return { items, total, page, pages };
}

export async function getCategories(): Promise<string[]> {
  if (isMongoConnected()) {
    const cats = await ProductModel.distinct("category");
    return (cats as string[]).filter(Boolean);
  }
  const set = new Set<string>();
  inMemoryProducts.forEach((p) => {
    if (p.category) set.add(p.category);
  });
  return Array.from(set);
}

export async function getProductById(id: string): Promise<(Product & { _id: string }) | null> {
  if (isMongoConnected()) {
  const doc = await (ProductModel as any).findById(id).lean();
    return (doc as any) ?? null;
  }
  return inMemoryProducts.find((p) => p._id === id) ?? null;
}

export async function createProduct(data: Partial<Product>): Promise<Product & { _id: string }> {
  if (isMongoConnected()) {
  const doc = await (ProductModel as any).create(data);
  return (await doc.toObject()) as any;
  }
  const created = {
    _id: String(nextId++),
    name: data.name || "Unnamed",
    description: data.description || "",
    price: data.price || 0,
    // prefer images array when present
    images: Array.isArray((data as any).images) ? (data as any).images : [],
    image: (Array.isArray((data as any).images) && (data as any).images[0]) || data.image || "",
    stock: data.stock || 0,
    category: data.category || "",
    featured: !!data.featured,
  } as Product & { _id: string };
  inMemoryProducts.push(created);
  return created;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<(Product & { _id: string }) | null> {
  if (isMongoConnected()) {
  const doc = await (ProductModel as any).findByIdAndUpdate(id, data, { new: true }).lean();
    return (doc as any) ?? null;
  }
  const idx = inMemoryProducts.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  const merged = { ...inMemoryProducts[idx], ...data } as any;
  // keep image in sync with images array
  if (Array.isArray((data as any).images) && (data as any).images.length > 0) {
    merged.images = (data as any).images;
    merged.image = (data as any).images[0];
  }
  inMemoryProducts[idx] = merged;
  return inMemoryProducts[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isMongoConnected()) {
  const res = await (ProductModel as any).findByIdAndDelete(id);
    return !!res;
  }
  const before = inMemoryProducts.length;
  inMemoryProducts = inMemoryProducts.filter((p) => p._id !== id);
  return inMemoryProducts.length < before;
}
