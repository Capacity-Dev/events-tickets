import { Form } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function AdminCategories({ categories }: { categories: any[] }) {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Categories</h1>

      <div className="border rounded-xl p-5 bg-card mb-8 max-w-sm">
        <h2 className="text-lg font-semibold mb-4">New Category</h2>
        <Form route="admin.categories.store" className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="slug">Slug (leave blank to auto-generate)</Label>
            <Input id="slug" name="slug" />
          </div>
          <div>
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue="0" />
          </div>
          <Button type="submit">Create Category</Button>
        </Form>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{cat.slug}</TableCell>
                <TableCell className="text-sm">{cat.displayOrder}</TableCell>
                <TableCell className="text-right">
                  <form action={`/admin/categories/${cat.id}`} method="POST" className="inline">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-destructive text-destructive h-7 px-2 text-xs font-medium bg-transparent cursor-pointer hover:bg-destructive/10">Delete</button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
