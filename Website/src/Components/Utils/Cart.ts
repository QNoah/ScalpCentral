export function getCartId(): string {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
        cartId = crypto.randomUUID();
        localStorage.setItem("cartId", cartId);
    }

    return cartId;
}