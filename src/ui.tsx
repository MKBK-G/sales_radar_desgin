import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"

export function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "danger"
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input ${props.className || ""}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`input textarea ${props.className || ""}`}
    />
  )
}

export function Select({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`input select ${props.className || ""}`}>
      {children}
    </select>
  )
}

export function Heading({
  children,
  className = "",
  level = 2,
}: {
  children: ReactNode
  className?: string
  level?: 1 | 2 | 3
}) {
  if (level === 1) return <h1 className={className}>{children}</h1>
  if (level === 3) return <h3 className={className}>{children}</h3>
  return <h2 className={className}>{children}</h2>
}

export type IconName = "grid" | "sparkles" | "users" | "chart" | "briefcase" | "settings" | "help" | "chevron" | "arrow" | "search" | "plus" | "close" | "more" | "clock" | "calendar" | "check" | "phone" | "mail" | "file" | "external" | "building" | "target" | "history" | "bell" | "logout" | "filter" | "message" | "star" | "thumbUp" | "thumbDown" | "pin" | "globe"

export function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: IconName
  size?: number
  className?: string
}) {
  const paths: Record<IconName, ReactNode> = {
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 6.5a16 16 0 0 0 14 0M5 17.5a16 16 0 0 1 14 0" />
      </>
    ),
    star: (
      <path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L2.9 9.6l6.3-.9Z" />
    ),
    thumbUp: (
      <>
        <path d="M7 10v11H3V10ZM7 10l5-8c2 0 3 1 2 5l-.5 3H20a2 2 0 0 1 2 2l-2 7a3 3 0 0 1-3 2H7" />
      </>
    ),
    thumbDown: (
      <>
        <path d="M7 14V3H3v11ZM7 14l5 8c2 0 3-1 2-5l-.5-3H20a2 2 0 0 0 2-2l-2-7a3 3 0 0 0-3-2H7" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z" />
        <path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M8 15l4-5 4 3 5-8" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4h8v3M3 12a22 22 0 0 0 18 0M12 11v4" />
      </>
    ),
    settings: (
      <>
        <path d="m9 3-1 3-3 1-2 3 2 2-1 3 2 3h3l2 3 3-1 1-3 3-1 2-3-2-2 1-3-2-3h-3l-2-2Z" />
        <circle cx="11.5" cy="11.5" r="3" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1.5 1-1.5 1.5-1.5 3M12 17h.01" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    arrow: <path d="M4 12h15m-5-5 5 5-5 5" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 17h2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    phone: (
      <path d="m4 3 4-1 3 6-3 2c1 3 3 5 6 6l2-3 6 3-1 4c-.3 1-1 2-3 1C9 20 3 14 2 6c0-2 1-3 2-3Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H5v20h14V7Z" />
        <path d="M14 2v5h5M8 12h8M8 16h6" />
      </>
    ),
    external: (
      <>
        <path d="M14 3h7v7M21 3 10 14M10 3H3v18h18v-7" />
      </>
    ),
    building: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    history: (
      <>
        <path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l3 2" />
      </>
    ),
    bell: (
      <>
        <path d="M5 16h14l-2-3V8A5 5 0 0 0 7 8v5ZM10 20h4" />
      </>
    ),
    logout: (
      <>
        <path d="M10 3H4v18h6M10 12h11m-4-4 4 4-4 4" />
      </>
    ),
    filter: (
      <>
        <path d="M4 7h16M7 12h10M10 17h4" />
        <circle cx="8" cy="7" r="2" fill="currentColor" stroke="none" />
        <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
      </>
    ),
    message: <path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a9 9 0 1 1 17-5Z" />,
  }
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
