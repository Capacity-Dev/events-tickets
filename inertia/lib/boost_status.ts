export const boostStatusVariant: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  active: 'default',
  pending_payment: 'outline',
  launching: 'outline',
  paused: 'secondary',
  completed: 'secondary',
  failed: 'destructive',
  cancelled: 'destructive',
}
