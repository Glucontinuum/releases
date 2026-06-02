import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import ReleaseCard from './components/ReleaseCard'
import { useReleases } from './hooks/useReleases'
import { Activity, Bell, Calculator } from 'lucide-react'
import './App.css'

const REPO_OWNER = 'Glucontinuum'
const REPO_NAME = 'releases'

function App() {
  const { t } = useTranslation()
  const { releases, latestRelease, loading, error } = useReleases(REPO_OWNER, REPO_NAME)

  return (
    <>
      <Header owner={REPO_OWNER} repo={REPO_NAME} latestRelease={latestRelease} />

      <div className="section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <Activity className="feature-icon" size={28} />
              <h3>{t('features.monitoring.title')}</h3>
              <p>{t('features.monitoring.desc')}</p>
            </div>
            <div className="feature-card">
              <Bell className="feature-icon" size={28} />
              <h3>{t('features.alerts.title')}</h3>
              <p>{t('features.alerts.desc')}</p>
            </div>
            <div className="feature-card">
              <Calculator className="feature-icon" size={28} />
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
