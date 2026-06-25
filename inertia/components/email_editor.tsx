import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'

const EMAIL_VARIABLES = [
  'buyerName',
  'firstName',
  'orderNumber',
  'eventTitle',
  'eventDate',
  'venueName',
  'ticketCount',
  'ticketRowsHtml',
  'ticketList',
  'totalAmount',
  'currency',
]

interface TemplateEditorProps {
  open: boolean
  onClose: () => void
  template: any
  adminPrefix: string
  onSaved: () => void
}

export function TemplateEditor({
  open,
  onClose,
  template,
  adminPrefix,
  onSaved,
}: TemplateEditorProps) {
  const [subject, setSubject] = useState(template?.subject ?? '')
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: { HTMLAttributes: { class: 'font-bold' } },
        italic: { HTMLAttributes: { class: 'italic' } },
        strike: { HTMLAttributes: { class: 'line-through' } },
        code: { HTMLAttributes: { class: 'bg-muted px-1 rounded text-sm font-mono' } },
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder: 'Write your email template...' }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: template?.body ?? '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  if (!open) return null

  const insertVariable = (variable: string) => {
    editor?.chain().focus().insertContent(`{{${variable}}}`).run()
  }

  const handleSave = async () => {
    if (!editor) return
    setSaving(true)
    try {
      const html = editor.getHTML()
      const res = await fetch(`/${adminPrefix}/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: html, subject, channel: 'email' }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Template saved')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const ToolbarButton = ({
    active,
    onClick,
    children,
  }: {
    active?: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded h-7 w-7 text-sm hover:bg-muted',
        active && 'bg-muted text-primary'
      )}
    >
      {children}
    </button>
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Email Template — {template?.name ?? template?.type}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="tpl-subject">Subject</Label>
            <Input
              id="tpl-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line..."
            />
          </div>

          <div className="flex flex-wrap gap-1 border rounded-lg p-2 bg-muted/30">
            <span className="text-xs text-muted-foreground px-2 py-1 self-center mr-2">
              Variables:
            </span>
            {EMAIL_VARIABLES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => insertVariable(v)}
                className="inline-flex items-center rounded bg-background border border-border px-2 py-0.5 text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {`{{${v}}}`}
              </button>
            ))}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5 bg-muted/20">
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                active={editor?.isActive('bold')}
              >
                <strong>B</strong>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                active={editor?.isActive('italic')}
              >
                <em>I</em>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                active={editor?.isActive('strike')}
              >
                <s>S</s>
              </ToolbarButton>
              <span className="w-px h-5 bg-border mx-1" />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor?.isActive('heading', { level: 1 })}
              >
                H1
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor?.isActive('heading', { level: 2 })}
              >
                H2
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor?.isActive('heading', { level: 3 })}
              >
                H3
              </ToolbarButton>
              <span className="w-px h-5 bg-border mx-1" />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                active={editor?.isActive('bulletList')}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="8" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="8" y1="18" x2="20" y2="18" />
                  <circle cx="4" cy="6" r="1.5" />
                  <circle cx="4" cy="12" r="1.5" />
                  <circle cx="4" cy="18" r="1.5" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                active={editor?.isActive('orderedList')}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="10" y1="6" x2="20" y2="6" />
                  <line x1="10" y1="12" x2="20" y2="12" />
                  <line x1="10" y1="18" x2="20" y2="18" />
                  <text x="3" y="8" fontSize="10" fontWeight="bold">
                    1
                  </text>
                  <text x="3" y="14" fontSize="10" fontWeight="bold">
                    2
                  </text>
                  <text x="3" y="20" fontSize="10" fontWeight="bold">
                    3
                  </text>
                </svg>
              </ToolbarButton>
              <span className="w-px h-5 bg-border mx-1" />
              <ToolbarButton
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                active={editor?.isActive({ textAlign: 'left' })}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="17" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="10" x2="3" y2="10" />
                  <line x1="17" y1="14" x2="3" y2="14" />
                  <line x1="21" y1="18" x2="3" y2="18" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                active={editor?.isActive({ textAlign: 'center' })}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="6" />
                  <line x1="21" y1="10" x2="3" y2="10" />
                  <line x1="18" y1="14" x2="6" y2="14" />
                  <line x1="21" y1="18" x2="3" y2="18" />
                </svg>
              </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
