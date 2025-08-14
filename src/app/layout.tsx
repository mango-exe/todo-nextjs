'use client'
import '../styles/globals.css'
import styles from '@/app/layout.module.css'
import TopBar from '@/app/components/topbar'
import AppFooter from '@/app/components/app-footer'
import { SessionProvider } from 'next-auth/react'

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={styles.appContainer}>
        <div className={styles.navbarArea}>
          <TopBar />
        </div>
        <div className={styles.mainArea}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </div>
        <div className={styles.footerArea}>
          <AppFooter />
        </div>
      </body>
    </html>
  )
}
