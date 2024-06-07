export const metadata = {
  title: 'HTTP',
  description: 'HTTP',
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
