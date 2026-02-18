class CartManager {
    constructor() {
        this.storageKey = 'kairos_cart';
        this.isLoggedIn = document.body.dataset.userLoggedIn === 'true'; 
        this.items = this.loadLocal();
    }

    loadLocal() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveLocal() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        this.notify();
    }

    notify() {
        document.dispatchEvent(new CustomEvent('cart:updated', { 
            detail: { items: this.items, isLoggedIn: this.isLoggedIn } 
        }));
    }

    async addItem(product) {
        if (this.isLoggedIn) {
            try {
                const response = await fetch('/api/cart/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: [{ id: product.id, quantity: 1 }] })
                });
                const result = await response.json();
                this.notify();
                return result;
            } catch (error) {
                console.error('Server sync failed', error);
            }
        } else {
            const existing = this.items.find(item => String(item.id) === String(product.id));
            if (existing) {
                existing.quantity += 1;
            } else {
                this.items.push(product);
            }
            this.saveLocal();
        }
    }

    async getCart() {
        if (this.isLoggedIn) {
            const response = await fetch('/api/cart');
            const data = await response.json();
            this.items = data.items;
            return data;
        }
        return { items: this.items, total: this.calculateTotal() };
    }

    async clear() {
        if (this.isLoggedIn) {
            try {
                const cartData = await this.getCart();
                const items = cartData.items || cartData;
                
                const itemsToRemove = items.map(item => ({
                    id: item.id,
                    quantity: 0
                }));
                
                const response = await fetch('/api/cart/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: itemsToRemove })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                this.notify();
                return result;
            } catch (error) {
                console.error('Server clear failed', error);
                throw error;
            }
        } else {
            this.items = [];
            this.saveLocal();
        }
    }

    calculateTotal() {
        return this.items.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    }

    async syncLocalToServer() {
        if (!this.isLoggedIn || this.items.length === 0) return;
        
        await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: this.items })
        });
        
        localStorage.removeItem(this.storageKey);
    }

    async updateQuantity(productId, newQuantity) {
        if (this.isLoggedIn) {
            try {
                const response = await fetch('/api/cart/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        items: [{ 
                            id: productId, 
                            quantity: newQuantity
                        }] 
                    })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server error response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                this.notify();
                return result;
            } catch (error) {
                console.error('Server update failed:', error);
                throw error;
            }
        } else {
            const item = this.items.find(item => String(item.id) === String(productId));
            if (item) {
                if (newQuantity <= 0) {
                    this.items = this.items.filter(item => String(item.id) !== String(productId));
                } else {
                    item.quantity = newQuantity;
                }
                this.saveLocal();
            }
        }
    }

    async removeItem(productId) {
        return this.updateQuantity(productId, 0);
    }

    async decreaseQuantity(productId) {
        if (this.isLoggedIn) {
            const cartData = await this.getCart();
            const items = cartData.items || cartData;
            const item = items.find(item => String(item.id) === String(productId));
            
            if (item) {
                const newQuantity = Math.max(0, item.quantity - 1);
                return this.updateQuantity(productId, newQuantity);
            }
        } else {
            const item = this.items.find(item => String(item.id) === String(productId));
            if (item) {
                if (item.quantity <= 1) {
                    return this.removeItem(productId);
                } else {
                    return this.updateQuantity(productId, item.quantity - 1);
                }
            }
        }
    }
}

export const cartManager = new CartManager();