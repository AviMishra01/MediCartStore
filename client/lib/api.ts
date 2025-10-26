export interface ApiListParams {
  search?: string | null;
  category?: string | null;
  sort?: string | null;
  limit?: number | null;
  page?: number | null;
  featured?: boolean | null;
}

export async function apiGet<T>(path: string, params?: Record<string, any>, token?: string | null): Promise<T> {
  const usp = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}`.length > 0) usp.set(k, String(v));
    });
  }
  const url = usp.toString() ? `${path}?${usp.toString()}` : path;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: any, token?: string | null): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
