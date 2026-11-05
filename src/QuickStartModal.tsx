import { useEffect, useRef } from "react"
import QuickStartGuide, { type GuideDestination } from "./QuickStartGuide"

export default function QuickStartModal({
  open,
  onDismiss,
  onNavigate,
}: {
  open: boolean
  onDismiss: () => void
  onNavigate: (destination: GuideDestination) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      requestAnimationFrame(() => {
        if (!dialog.open && previous?.isConnected)
          previous.focus({ preventScroll: true })
      })
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="quick-start-modal"
      aria-label="快速上手指南"
      onCancel={(event) => {
        if (event.target !== event.currentTarget) return
        event.preventDefault()
        onDismiss()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onDismiss()
      }}
      onKeyDown={(event) => {
        if (
          event.key !== "Tab" ||
          dialogRef.current?.querySelector("dialog[open]")
        )
          return
        const nodes = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled)",
          ) || [],
        ).filter((node) => node.getClientRects().length > 0)
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialogRef.current)
        ) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
    >
      <QuickStartGuide
        mode="modal"
        active={open}
        onDismiss={onDismiss}
        onNavigate={onNavigate}
      />
    </dialog>
  )
}
