import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Bánh Mì Chả Cá Hieudeptrai | Dai Ngon, Nóng Hổi Chuẩn Vị',
  description: 'Thưởng thức bánh mì chả cá Hieudeptrai với chả cá biển dai ngọt, vỏ giòn rụm và nước sốt tỏi ớt đặc biệt. Đặt hàng ngay nhận ưu đãi!',
  keywords: [
    'bánh mì chả cá',
    'bánh mì Hieudeptrai',
    'bánh mì chả cá Hieudeptrai',
    'đặt bánh mì online',
    'bánh mì anh trai',
    'banhmianhtrai',
    'Hieudeptrai',
    'bánh mì anh trai',
  ],
  generator: 'Next.js',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: 'Bánh Mì Chả Cá Hieudeptrai | Dai Ngon, Nóng Hổi Chuẩn Vị',
    description: 'Thưởng thức bánh mì chả cá Hieudeptrai với chả cá biển dai ngọt, vỏ giòn rụm và nước sốt tỏi ớt đặc biệt. Đặt hàng ngay nhận ưu đãi!',
    siteName: 'Bánh Mì Chả Cá Hieudeptrai',
    images: [
      {
        url: 'https://banhmianhtrai.shop/banner_combo.png',
        width: 1376,
        height: 768,
        alt: 'Bánh mì chả cá Hieudeptrai nóng giòn thơm ngon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bánh Mì Chả Cá Hieudeptrai | Dai Ngon, Nóng Hổi Chuẩn Vị',
    description: 'Thưởng thức bánh mì chả cá Hieudeptrai với chả cá biển dai ngọt, vỏ giòn rụm và nước sốt tỏi ớt đặc biệt.',
    images: ['https://banhmianhtrai.shop/banner_combo.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FastFoodRestaurant',
    name: 'Bánh Mì Chả Cá Hieudeptrai',
    alternateName: 'Bánh Mì Anh Trai',
    url: 'https://banhmianhtrai.shop',
  }

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
