declare module '@hookform/resolvers/zod' {
  import { Resolver } from 'react-hook-form'
  import { ZodTypeAny } from 'zod'
  export function zodResolver<T extends ZodTypeAny>(schema: T): Resolver<any, any>
  export default zodResolver
}
