import { useTranslation } from 'react-i18next'
import styles from './Header.module.css'
import { ExternalLink, Download, Moon, Sun } from 'lucide-react'
import { selectDownloadAsset, type GitHubRelease } from '../services/github'

interface HeaderProps {
  owner: string
  repo: string
  latestRelease: GitHubRelease | null
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const Header: React.FC<HeaderProps> = ({ owner, repo, latestRelease, theme, onToggleTheme }) => {
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR')
  }

  const downloadAsset = latestRelease ? selectDownloadAsset(latestRelease) : null

  const version = latestRelease?.tag_name ?? 'v1.0.0'

  return (
    <header id="top" className={styles.hero}>
      <nav className={styles.nav} aria-label={t('navigation.label')}>
        <a href="#top" className={styles.brand} aria-label={t('navigation.home')}>
          <img
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            alt=""
            aria-hidden="true"
            className={styles.logo}
            width={48}
            height={48}
          />
          <span>Glucontinuum</span>
        </a>

        <div className={styles.navActions}>
          <button
            type="button"
            onClick={onToggleTheme}
            className={styles.iconButton}
            aria-label={t(theme === 'light' ? 'theme.switchToDark' : 'theme.switchToLight')}
            title={t(theme === 'light' ? 'theme.switchToDark' : 'theme.switchToLight')}
          >
            {theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
          </button>
          <button type="button" onClick={toggleLang} className={styles.langToggle} aria-label={t('language.switch')}>
            {t('lang')}
          </button>
        </div>
      </nav>

      <div className={styles.heroContent}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          {t('hero.badge', { version })}
        </span>

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
