import {useEffect, useState} from "react";
import {sleep} from "@utils/sleep.ts";

const MAX_TRIES = 12;
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
            console.log("Observation is not started");
            return
        }

        let isDisposed = false;

        let func = async () => {
            let tries = 0;

            while (tries < MAX_TRIES) {
                console.log("Start observation iteration!");

                if (!isStarted) {
                    console.log("Observation stopped");
                    break
                }

                try {
                    console.log("Polling...");
                    const isDone = await poll(data);

                    if (isDone) {
                        console.log("Observation done");
                        setIsStarted(false)
                        break
                    }
                } catch (e) {
                    console.error("Error while fetching build file", e);
                }

                console.log("Sleeping...");
                await sleep(POLL_INTERVAL_MS)

                if (isDisposed) {
                    console.log("Observation disposed");
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
