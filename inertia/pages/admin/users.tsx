import { useTranslation } from '~/lib/i18n'
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
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">{t('admin.users.title')}</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.users.name')}</TableHead>
              <TableHead>{t('admin.users.email')}</TableHead>
              <TableHead>{t('admin.users.role')}</TableHead>
              <TableHead>{t('admin.users.joined')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName ?? '-'}</TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role?.name === 'admin'
                        ? 'default'
                        : user.role?.name === 'organizer'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {t('role.' + (user.role?.name ?? 'none'))}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
