import { AxiosError } from "axios";
import { useState } from "react";

export type IHttpRequestReturn<T, H = void> = [
  T,
  (payload?: H, callbacks?: CallbackFunctions<T>, isDataRefresh?: boolean) => Promise<T | void>,
  boolean,
  boolean,
  boolean,
  AxiosError,
  number,
  (data: T) => void
];
type CallbackFunctions<T> = {
  onError?: (e: AxiosError) => unknown;
  onSuccess?: (res: T) => unknown;
  onFinished?: () => unknown;
};
/**
 *
 * @param dataFetchCallback
 * @param initialValue
 * @returns [Data, onFetch, isLoading, isInit, isError, ErrorData, fetchCount, setData]
 */
export function useHttpRequest<T, H = void>(dataFetchCallback: (payload?: H) => Promise<T>, initialValue?: T): IHttpRequestReturn<T, H> {
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  const [data, setData] = useState<T>(initialValue);
  const [errorData, setErrorData] = useState<AxiosError>();

  async function request(payload?: H, callbacks?: CallbackFunctions<T>) {
    setLoading(true);

    setError(false);
    setErrorData(undefined);

    return dataFetchCallback?.(payload)
      .then((data) => {
        setData(data);
        setSuccess(true);
        setError(false);
        callbacks?.onSuccess?.(data);
      })
      .catch((e: AxiosError) => {
        setSuccess(false);
        setError(true);
        setErrorData(e);
        callbacks?.onError?.(e) || console.error(e);
        throw e;
      })
      .finally(() => {
        setLoading(false);
        setFetchCount((current) => current + 1);
        callbacks?.onFinished?.();
      });
  }

  return [data, request, loading, isSuccess, isError, errorData, fetchCount, setData];
}
