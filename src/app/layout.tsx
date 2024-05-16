import './globals.css';

export const metadata = {
  title: 'Create New Case',
  description: 'Create New Case',
}

export default function RootLayout({ children,}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full bg-white" lang="en">
    <body className="h-full">{children}</body>
    </html>
  )
}
