// TODO: Add session id and cookies data
export class MockCookie {
  get cookies(): string {
    const cookies: Record<string, string> = {}

    return Object.entries(cookies)
      .map(([key, val]) => `${key}=${val}`)
      .join('; ')
  }
}
