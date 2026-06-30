import 'reflect-metadata'

declare module '@japa/api-client' {
  interface ApiRequest<In, Out, Cookies> {
    withInertia(): this
    inertiaPage(): any
  }

  interface TestContext {
    client: any
  }
}
