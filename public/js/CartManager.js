class CartManager {
    constructor() {
        this.storagekey = 'kairos_cart';
        this.items = this.load();
    }

    load() {
        const data = localStorage.getItem(this.storagekey);
        return data ? JSON.parse(data) : [];
    }

    save() {
        localStorage.setItem(this.storagekey, JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('cart:updated'));
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.save();
        }
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}

export const cartManager = new CartManager();