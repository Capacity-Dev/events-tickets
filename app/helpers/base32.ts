const BASE32_ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567'

export function encodeBase32(num: number): string {
  if (num === 0) return 'a'
  let result = ''
  let n = Math.floor(num)
  while (n > 0) {
    result = BASE32_ALPHABET[n & 31] + result
    n = Math.floor(n / 32)
  }
  return result
}

export function generatePrivateSlug(slug: string): string {
  return `${slug}-${encodeBase32(Date.now())}`
}
