import { useTranslation } from 'react-i18next'
import styles from './Header.module.css'
import { ExternalLink, Download } from 'lucide-react'
import type { GitHubRelease } from '../services/github'

interface HeaderProps {
  owner: string
  repo: string
  latestRelease: GitHubRelease | null
}

const Header: React.FC<HeaderProps> = ({ owner, repo, latestRelease }) => {
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR')
  }

  const downloadAsset = latestRelease?.assets.find(a =>
    a.name.endsWith('.apk') || a.name.endsWith('.exe') || a.name.endsWith('.dmg') || a.name.endsWith('.zip')
  ) || latestRelease?.assets[0]

  const version = latestRelease?.tag_name ?? 'v1.0.0'

  return (
    <header className={styles.hero}>
      <nav className={styles.nav}>
        <div />
        <button onClick={toggleLang} className={styles.langToggle}>
          {t('lang')}
        </button>
      </nav>

      <div className={styles.heroContent}>
        <div className={styles.logoSection}>
          <img
            src="favicon.svg"
            alt="Glucontinuum"
            className={styles.logo}
            width={72}
            height={72}
          />
          <span className={styles.badge}>{t('hero.badge', { version })}</span>
        </div>

        <h1 className={styles.title}>{t('hero.title')}</h1>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>

        <div className={styles.actions}>
          {downloadAsset ? (
            <a href={downloadAsset.browser_download_url} className={styles.btnPrimary}>
              <Download size={20} />
              {t('hero.download', { version })}
            </a>
          ) : (
            <a href="#releases" className={styles.btnPrimary}>
              {t('hero.downloadFallback')}
            </a>
          )}
          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondary}
          >
            <ExternalLink size={18} />
            {t('hero.sourceCode')}
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
