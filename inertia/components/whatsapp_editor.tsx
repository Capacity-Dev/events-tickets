import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { toast } from 'sonner'

const WHATSAPP_VARIABLES = [
  'buyerName',
  'firstName',
  'orderNumber',
  'eventTitle',
  'eventDate',
  'venueName',
  'ticketCount',
  'ticketList',
  'totalAmount',
]

interface WhatsAppEditorProps {
  open: boolean
  onClose: () => void
  template: any
  adminPrefix: string
  onSaved: () => void
}

function renderMarkdownPreview(text: string): string {
  return text
    .replace(/\*(.+?)\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/~(.+?)~/g, '<del>$1</del>')
    .replace(/```([^`]+)```/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>')
    .replace(/\{\{(\w+)\}\}/g, '<span class="var-tag">{{$1}}</span>')
}

export function WhatsAppEditor({
  open,
  onClose,
  template,
  adminPrefix,
  onSaved,
}: WhatsAppEditorProps) {
  const [body, setBody] = useState(template?.body ?? '')
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const insertVariable = (variable: string) => {
    setBody((prev: string) => prev + `{{${variable}}}`)
  }

  const applyFormat = (format: string) => {
    const textarea = document.getElementById('ws-editor') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = body.slice(start, end)
    let replacement = ''
    switch (format) {
      case 'bold':
        replacement = `*${selected || 'text'}*`
        break
      case 'italic':
        replacement = `_${selected || 'text'}_`
        break
      case 'strikethrough':
        replacement = `~${selected || 'text'}~`
        break
      case 'code':
        replacement = `\`\`\`${selected || 'text'}\`\`\``
        break
    }
    setBody(body.slice(0, start) + replacement + body.slice(end))
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + replacement.length, start + replacement.length)
    }, 0)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/${adminPrefix}/templates/${template.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, channel: 'whatsapp' }),
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

  const truncatedPreview = body.length > 800 ? body.slice(0, 800) + '\n\n…' : body

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit WhatsApp Template — {template?.name ?? template?.type}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1 border rounded-lg p-2 bg-muted/30">
            <span className="text-xs text-muted-foreground px-2 py-1 self-center mr-2">
              Variables:
            </span>
            {WHATSAPP_VARIABLES.map((v) => (
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

          <div className="flex gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => applyFormat('bold')}
              className="inline-flex items-center rounded border border-border px-2 py-1 text-xs font-bold hover:bg-muted"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat('italic')}
              className="inline-flex items-center rounded border border-border px-2 py-1 text-xs italic hover:bg-muted"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat('strikethrough')}
              className="inline-flex items-center rounded border border-border px-2 py-1 text-xs line-through hover:bg-muted"
            >
              S
            </button>
            <button
              type="button"
              onClick={() => applyFormat('code')}
              className="inline-flex items-center rounded border border-border px-2 py-1 text-xs font-mono hover:bg-muted"
            >
              {'<>'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ws-editor" className="mb-2 block">
                Message
              </Label>
              <textarea
                id="ws-editor"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                placeholder="Write your WhatsApp message... Use {{variable}} for dynamic content."
              />
              <span className="text-xs text-muted-foreground">{body.length} chars</span>
            </div>
            <div>
              <Label className="mb-2 block">Preview</Label>
              <div
                className="rounded-lg border border-border bg-card p-4 text-sm min-h-[300px] whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(truncatedPreview) }}
              />
            </div>
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
