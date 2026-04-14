export function extractMessage(err: unknown, fallback: string): string {
    if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
    ) {
        const msg = (err.response.data as { message: unknown }).message
        return typeof msg === 'string' ? msg : fallback
    }
    return fallback
}
