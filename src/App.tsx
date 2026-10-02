import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import ReleaseCard from './components/ReleaseCard'
import { useReleases } from './hooks/useReleases'
import { selectDownloadAsset } from './services/github'
import { Activity, Bell, Calculator } from 'lucide-react'
import './App.css'

type ThemeMode = 'light' | 'dark'

function getInitialTheme(): ThemeMode {
  try {
    const savedTheme = window.localStorage.getItem('glucontinuum-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    // Continue with the operating system preference when storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const REPO_OWNER = 'Glucontinuum'
const REPO_NAME = 'releases'

function App() {
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const { releases, latestRelease, loading, error } = useReleases(REPO_OWNER, REPO_NAME)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    try {
      window.localStorage.setItem('glucontinuum-theme', nextTheme)
    } catch {
      // The selected theme still applies for this session when storage is unavailable.
    }
    setTheme(nextTheme)
  }

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language
  }, [i18n.language, i18n.resolvedLanguage])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('download') !== 'latest' || loading) return

    if (!latestRelease) {
      window.location.hash = 'releases'
      return
    }

    const downloadAsset = selectDownloadAsset(latestRelease)
    window.location.assign(downloadAsset?.browser_download_url ?? latestRelease.html_url)
  }, [latestRelease, loading])

  return (
    <>
      <Header
        owner={REPO_OWNER}
        repo={REPO_NAME}
        latestRelease={latestRelease}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true"><Activity size={24} /></div>
              <h3>{t('features.monitoring.title')}</h3>
              <p>{t('features.monitoring.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true"><Bell size={24} /></div>
              <h3>{t('features.alerts.title')}</h3>
              <p>{t('features.alerts.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true"><Calculator size={24} /></div>
              <h3>{t('features.calculations.title')}</h3>
              <p>{t('features.calculations.desc')}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="section" id="releases">
        <div className="container">
          <h2 className="section-title">{t('releases.title')}</h2>

          {loading && (
            <div className="status">
              <p>{t('releases.loading')}</p>
            </div>
          )}

          {error && (
            <div className="status-error" role="alert">
              <p>{t('releases.error')}</p>
            </div>
          )}

          {!loading && !error && releases.length === 0 && (
            <div className="status">
              <p>{t('releases.empty')}</p>
            </div>
          )}

          <div className="release-list">
            {releases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      </section>

      <footer className="page-footer container">
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <span>{t('footer.tagline')}</span>
        <div className="footer-right">
          <a href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </>
  )
}

export default App
