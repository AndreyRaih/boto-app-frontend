export default class BotoLocalStorageManager {
    set(key, value, ttl) {
        const expire = ttl ? Date.now() + (ttl * 1000) : null;
        const item = {
            value,
            expire
        }
        localStorage.setItem(key, JSON.stringify(item));
    }

    get(key) {
        const item = localStorage.getItem(key);
        if (item) {
            const { value, expire } = JSON.parse(item);
            if (Date.now() > expire) {
                localStorage.removeItem(key)
                return;
            } else {
                return value;
            }
        }
    }

    has(key) {
        return Boolean(localStorage.getItem(key));
    }

    remove(key) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}