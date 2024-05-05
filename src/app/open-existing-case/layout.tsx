export const metadata = {
  title: 'Open Existing Case',
  description: 'Open Existing Case',
}

export default function RootLayout({children,}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full bg-gray-100" lang="pt-br">
    <body className="h-full">
      {children}
    </body>
    </html>
  )
}
