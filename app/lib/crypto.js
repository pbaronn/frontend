export const generateKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true, ["sign", "verify"]
    );
    
    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const publicKeyB64 = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey)));
    
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const privateKeyB64 = btoa(String.fromCharCode.apply(null, new Uint8Array(privateKey)));
    localStorage.setItem('privateKey', privateKeyB64);
    
    return { publicKeyB64 };
};

export const hashData = async (data) => {
    const encoder = new TextEncoder();
    const dataString = JSON.stringify(data);
    const dataBuffer = encoder.encode(dataString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

async function importPrivateKey(pkcs8B64) {
    const pkcs8Der = Uint8Array.from(atob(pkcs8B64), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        "pkcs8", pkcs8Der, { name: "ECDSA", namedCurve: "P-256" },
        true, ["sign"]
    );
}

export const signHash = async (hashHex) => {
    const privateKeyB64 = localStorage.getItem('privateKey');
    if (!privateKeyB64) throw new Error("Private key not found.");
    
    const privateKey = await importPrivateKey(privateKeyB64);
    const dataBuffer = new TextEncoder().encode(hashHex);

    const signatureBuffer = await window.crypto.subtle.sign(
        { name: "ECDSA", hash: { name: "SHA-256" } },
        privateKey, dataBuffer
    );
    
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    return btoa(signatureArray.map(b => String.fromCharCode(b)).join(''));
};

export async function verifySignature(publicKeyB64, signatureB64, originalHashHex) {
    try {
        const publicKeyDer = Uint8Array.from(atob(publicKeyB64), c => c.charCodeAt(0));
        const publicKey = await window.crypto.subtle.importKey(
            "spki", publicKeyDer, { name: "ECDSA", namedCurve: "P-256" }, true, ["verify"]
        );

        const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
        const dataToVerify = new TextEncoder().encode(originalHashHex);
        
        return await window.crypto.subtle.verify(
            { name: "ECDSA", hash: { name: "SHA-256" } },
            publicKey, signature, dataToVerify
        );
    } catch (error) {
        console.error("Verification error:", error);
        return false;
    }
}