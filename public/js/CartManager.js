class CartManager {
    constructor() {
        this.storageKey = 'kairos_cart';
        this.items = this.load();
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to parse cart data', e);
            return [];
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: this.items } }));
    }

    addItem(product) {
        const id = String(product.id);
        const existing = this.items.find(item => String(item.id) === id);
        if (existing) {
            existing.quantity = (existing.quantity || 0) + 1;
        } else {
            this.items.push({ ...product, id, quantity: 1 });
        }
        this.save();
    }

    removeItem(productId) {
        const id = String(productId);
        this.items = this.items.filter(item => String(item.id) !== id);
        this.save();
    }

    updateQuantity(productId, quantity) {
        const id = String(productId);
        const item = this.items.find(item => String(item.id) === id);
        if (item) {
            item.quantity = Number(quantity) || 0;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.save();
            }
        }
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    }

    clear() {
        this.items = [];
        this.save();
    }
}

export const cartManager = new CartManager();