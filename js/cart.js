/**
 * cart.js — 购物车 localStorage 状态管理
 * 购物车数据结构：{ [productId]: { productId, name, price, qty, stock } }
 */

const CART_KEY = "stall_cart";

const Cart = {
  /** 读取购物车 */
  get() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    } catch {
      return {};
    }
  },

  /** 将购物车写回 localStorage */
  _save(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  /**
   * 设置某商品的数量。
   * qty <= 0 时自动从购物车删除；qty > stock 时自动截断到 stock。
   */
  setQty(product, qty) {
    const cart = this.get();
    const capped = Math.min(Math.max(0, qty), product.stock);
    if (capped <= 0) {
      delete cart[product.id];
    } else {
      cart[product.id] = {
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: capped,
        stock: product.stock,
      };
    }
    this._save(cart);
    return cart;
  },

  /** 增加 delta 件（可为负数） */
  add(product, delta = 1) {
    const cart = this.get();
    const current = cart[product.id]?.qty ?? 0;
    return this.setQty(product, current + delta);
  },

  /** 从购物车移除某商品 */
  remove(productId) {
    const cart = this.get();
    delete cart[productId];
    this._save(cart);
    return cart;
  },

  /** 清空购物车 */
  clear() {
    localStorage.removeItem(CART_KEY);
  },

  /** 购物车商品总件数 */
  count(cart) {
    return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  },

  /** 计算总价（分） */
  total(cart) {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
  },

  /** 将购物车转为核销二维码的 items 数组 */
  toItems(cart) {
    return Object.values(cart).map(({ productId, qty }) => ({
      productId,
      qty,
    }));
  },
};
