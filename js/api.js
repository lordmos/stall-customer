/**
 * api.js — 封装对 /stall/ 接口的 fetch 调用
 * 依赖：config.js（须在此文件之前加载）
 */

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || data.code || "请求失败");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const Api = {
  /** 获取上架商品列表（仅 is_on_sale=1 的商品） */
  getProducts() {
    return apiFetch("/stall/products?all=0");
  },
  /** 获取全部商品（含库存），用于核销前校验 */
  getAllProducts() {
    return apiFetch("/stall/products?all=1");
  },
};
