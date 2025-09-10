import {ApkInfo} from "@utils/apk.ts";

export class WorkerClient {
    static async calculateApkInfo(file: File): Promise<ApkInfo> {
        return await new Promise((resolve, reject) => {
            const worker = new Worker(new URL('../../utils/apkInfo.worker.ts', import.meta.url), { type: 'module' }) // TODO remove path
            const done = () => worker.terminate()
            worker.onmessage = (e: MessageEvent) => {
                const data = e.data as any
                if (data && data.ok) {
                    done()
                    resolve(data.info as ApkInfo)
                } else {
                    done()
                    reject(new Error(data?.error ?? 'Failed to calculate apk info'))
                }
            }
            worker.onerror = (err) => {
                done()
                console.error(err)
                reject(err as unknown as Error)
            }
            worker.postMessage({ file })
        })
    }

}