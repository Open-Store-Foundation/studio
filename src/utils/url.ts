
export function addParamsToPath(newParams: Map<string, string>) {
    const params = new URLSearchParams(window.location.search);
    newParams.forEach((value, key) => {
        params.set(key, value);
    })

    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
}

export function decodePath(value: string) {
    try {
        return value
            .split("/")
            .map((v) => decodeURIComponent(v).replace(/\//g, "%2F"))
            .join("/");
    } catch (error) {
        console.error(
            false,
            `The URL path "${value}" could not be decoded because it is a ` +
            `malformed URL segment. This is probably due to a bad percent ` +
            `encoding (${error}).`,
        );

        return value;
    }
}

export function addSubdomain(url: string, subdomain: string): string {
    const parsed = new URL(url);
    parsed.hostname = `${subdomain}.${parsed.hostname}`;
    return parsed.toString();
}