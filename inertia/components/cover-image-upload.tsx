import { useState, useCallback, useRef } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = new Image()
  image.src = imageSrc
  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
  })
}

interface CoverImageUploadProps {
  name: string
  existingUrl?: string
}

export default function CoverImageUpload({ name, existingUrl }: CoverImageUploadProps) {
  const [preview, setPreview] = useState<string>(existingUrl ?? '')
  const [cropSrc, setCropSrc] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [showCrop, setShowCrop] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setCropSrc(reader.result as string)
      setShowCrop(true)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const confirmCrop = useCallback(async () => {
    if (!cropSrc || !croppedAreaPixels) return
    const base64 = await getCroppedImg(cropSrc, croppedAreaPixels)
    setPreview(base64)
    setShowCrop(false)
    setCropSrc('')
  }, [cropSrc, croppedAreaPixels])

  const removeImage = useCallback(() => {
    setPreview('')
  }, [])

  return (
    <div>
      <input type="hidden" name={name} value={preview} />

      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'
          }`}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-3 text-muted-foreground"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WebP (max 5MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border">
          <img src={preview} alt="Cover preview" className="w-full h-48 object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                  e.target.value = ''
                }}
              />
            </Button>
            <Button type="button" variant="destructive" size="xs" onClick={removeImage}>
              Remove
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showCrop} onOpenChange={setShowCrop}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-72 bg-muted rounded-lg overflow-hidden">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCrop(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCrop}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
