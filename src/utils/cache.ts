
export interface CacheEntry<T> {
    expired: number
    data: T
}

export interface Cache {
    key: string,
    ttl: number,
}

export class TimedCache {

    private data: Map<string, CacheEntry<any>>

    static create() {
        return new TimedCache()
    }

    private constructor() {
        this.data = new Map()
    }

    async getOrLoad<T>(key: string, ttl: number, loader: () => Promise<any>) {
        const entry = this.data.get(key)
        if (entry) {
            return entry.data as T
        }

        const data = await loader() as T

        this.set(key, data, ttl)

        return data
    }

    get<T>(key: string) {
        const entry = this.data.get(key)

        if (!entry) {
            return null
        }

        if (entry.expired < Date.now()) {
            return null
        }

        return entry.data as T
    }

    set<T>(key: string, data: T, ttl: number) {
        this.data.set(key, {
            expired: Date.now() + ttl,
            data: data
        })
    }

    has(key: string) {
        return this.data.has(key)
    }

    clean() {
        this.data.clear()
    }

    delete(key: string) {
        this.data.delete(key)
        return this
    }
}
