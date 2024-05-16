export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full bg-gray-100" lang="en">
      <body className="h-full">{children}</body>
    </html>
  )
}
