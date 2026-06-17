export function getCartId(): string {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
        cartId = crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);;
        localStorage.setItem("cartId", cartId);
    }

    return cartId;
}