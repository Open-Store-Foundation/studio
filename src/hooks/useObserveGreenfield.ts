import {useEffect, useState} from "react";
import {sleep} from "@utils/sleep.ts";

const MAX_TRIES = 24;
const POLL_INTERVAL_MS = 5_000;

export function useObserveGreenfield<T>(poll: (data: T | null) => Promise<boolean>, queryKey: any[]) {
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [data, setData] = useState<T | null>(null);

    const startObserver = (data?: T) => {
        setData(data || null)
        setIsStarted(true)
    }

    useEffect(() => {
        if (!isStarted) {
            return
        }

        let isDisposed = false;

        let func = async () => {
            let tries = 0;

            while (tries < MAX_TRIES) {
                if (!isStarted) {
                    break
                }

                try {
                    const isDone = await poll(data);

                    if (isDone) {
                        setIsStarted(false)
                        break
                    }
                } catch (e) {
                    console.error("Error while fetching build file", e);
                }

                await sleep(POLL_INTERVAL_MS)

                if (isDisposed) {
                    break
                }

                tries++;
            }
        }

        func().then()

        return () => {
            isDisposed = true
        }
    }, [isStarted, data, ...queryKey])

    return { isObservingBuild: isStarted, startObserver }
}
