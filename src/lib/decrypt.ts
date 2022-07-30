const apiBaseURL="https://crypithm.com/api"

export async function getChunk(): Promise<void> {

}

async function decryptBlob(k: CryptoKey, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    return await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, k, data)
}