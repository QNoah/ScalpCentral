export const setCookie = (name: string, token: string, days?: number) => {
    const cookieBase = `${encodeURIComponent(name)}=${encodeURIComponent(token)}; path=/;`;

    const maxAge = days ? `max-age=${days * 24 * 60 * 60};` : "";

    const sameSite = "SameSite=Lax;";
    const secure = location.protocol === "https:" ? "Secure;" : "";
    document.cookie = cookieBase + maxAge + sameSite + secure;
};

export function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

export const removeCookie = (name: string) => {
    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0;`;
};