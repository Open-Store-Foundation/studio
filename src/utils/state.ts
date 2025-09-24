
// export type ScreenState<T, E> = UseQueryResult<T, E>

import {useEffect, useState} from "react"

export function useAsyncEffect(
    queryFn: () => Promise<void>,
    queryKey: any[]
) {
    useEffect(() => {
        queryFn()
            .then()
    }, queryKey)
}

export interface EitherState<T, E> {
    isLoading: boolean
    data: T | null
    error: E | null
}

export class S {
    static loading<T, E>(isLoading?: boolean): EitherState<T, E> {
        return {
            isLoading: isLoading ?? true,
            data: null,
            error: null
        }
    }

    static error<T, E>(error: E): EitherState<T, E> {
        return {
            isLoading: false,
            data: null,
            error
        }
    }

    static data<T, E>(data: T): EitherState<T, E> {
        return {
            isLoading: false,
            data,
            error: null
        }
    }
}

export function useScreenState<T, E = void>(
    params?: {
        initLoadings?: boolean,
        initData?: T,
        initError?: E,
    }
) {
    const [isLoading, setLoading] = useState<boolean>(params?.initLoadings ?? true)
    const [data, setData] = useState<T | null>(params?.initData ?? null)
    const [error, setError] = useState<E | null>(params?.initError ?? null)
    const [retryCount, retryInternal] = useState<number>(0)

    const setState = (state: EitherState<T, E>) => {
        setError(state.error)
        setData(state.data)
        setLoading(state.isLoading)
    }

    const retry = () => {
        retryInternal(retryCount + 1)
    }

    return {
        isLoading, setLoading,
        data, setData,
        error, setError,
        retryCount, retry,
        setState
    }
}
