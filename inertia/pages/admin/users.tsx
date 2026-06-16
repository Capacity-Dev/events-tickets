import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminUsers({ users }: { users: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">User Management</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName ?? '-'}</TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role?.name === 'admin' ? 'default' : user.role?.name === 'organizer' ? 'secondary' : 'outline'}>
                    {user.role?.name ?? 'none'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
