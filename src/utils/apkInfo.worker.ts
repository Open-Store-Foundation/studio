import {ApkParser} from "./apk.ts";

self.onmessage = async (event: MessageEvent) => {
    const file = event.data?.file as File | undefined
    const ctx: any = self as any
    if (!file) {
        ctx.postMessage({ ok: false, error: "No file" })
        return
    }
    try {
        const info = await ApkParser.calculateApkInfoDirect(file)
        ctx.postMessage({ ok: true, info: info })
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        ctx.postMessage({ ok: false, error: message })
    }
}


