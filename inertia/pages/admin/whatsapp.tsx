import { Form } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminWhatsApp({ templates }: { templates: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">WhatsApp Templates</h1>

      <div className="border rounded-xl p-5 bg-card mb-8 max-w-md">
        <h2 className="text-lg font-semibold mb-4">New Template</h2>
        <Form route="admin.whatsapp.store" className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="utility">Utility</option>
              <option value="authentication">Authentication</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div>
            <Label htmlFor="languageCode">Language</Label>
            <Input id="languageCode" name="languageCode" defaultValue="en_US" />
          </div>
          <div>
            <Label htmlFor="variables">Variables (JSON array)</Label>
            <Input id="variables" name="variables" placeholder='["event_name","ticket_type"]' />
          </div>
          <Button type="submit">Create Template</Button>
        </Form>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No templates
                </TableCell>
              </TableRow>
            ) : (
              templates.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-sm capitalize">{t.category}</TableCell>
                  <TableCell className="text-sm">{t.languageCode}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.status === 'approved'
                          ? 'default'
                          : t.status === 'rejected'
                            ? 'destructive'
                            : 'outline'
                      }
                    >
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
