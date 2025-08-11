import '../styles/globals.css'
import styles from '@/app/layout.module.css'
import TopBar from '@/components/topbar'
import AppFooter from '@/components/app-footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={styles.appContainer}
      >
        <div className={styles.navbarArea}>
          <TopBar />
        </div>
        <div className={styles.mainArea}>
          {children}
        </div>
        <div className={styles.footerArea}>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
