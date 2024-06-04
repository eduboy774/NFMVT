export const metadata = {
  title: 'HTTP Requests',
  description: 'HTTP Requests',
}

export default function RootLayout({children,}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full bg-gray-100">
    <body className="h-full">{children}</body>
    </html>
  )
}
