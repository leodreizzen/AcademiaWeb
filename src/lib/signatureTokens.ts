export const tokenCooldownSeconds = 10*60
export function tokenExpired(issuedAt: Date): boolean {
    const now = new Date()
    return now.getTime() - issuedAt.getTime() > 1000 * tokenCooldownSeconds
}
export function tokenOnCooldown(issuedAt: Date): boolean {
    return tokenCooldownTimeRemaining(issuedAt) > 0
}

export function tokenCooldownTimeRemaining(issuedAt: Date): number {
    const now = new Date()
    return Math.max(0, Math.ceil(tokenCooldownSeconds - (now.getTime() - issuedAt.getTime()) / 1000));
}
