import React from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import type { GitHubRelease } from '../services/github'
import styles from './ReleaseCard.module.css'
import { Download, ExternalLink, Calendar, Tag } from 'lucide-react'

interface ReleaseCardProps {
  release: GitHubRelease
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const { t } = useTranslation()
  const isPrerelease = release.tag_name.includes('-') || /\d+\.\d+\.\d+\.\d+/.test(release.tag_name)

  const locale = document.documentElement.lang || 'en-US'
  const dateFormat = locale === 'pt-BR' ? "d 'de' MMMM 'de' yyyy" : 'MMMM d, yyyy'

  const publishedDate = format(new Date(release.published_at), dateFormat)

  return (
    <article className={`${styles.card} ${isPrerelease ? styles.prerelease : ''}`}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.tag}>
            <Tag size={14} />
            {release.tag_name}
          </span>
          <span className={styles.date}>
            <Calendar size={14} />
            {publishedDate}
          </span>
          {isPrerelease && <span className={styles.preBadge}>pre-release</span>}
        </div>
      </div>

      {release.name && release.name !== release.tag_name && (
        <h3 className={styles.name}>{release.name}</h3>
      )}

      {release.body && (
        <div className={styles.body}>
          <ReactMarkdown>{release.body}</ReactMarkdown>
        </div>
      )}

      {release.assets.length > 0 && (
        <div className={styles.assetsSection}>
          {release.assets.map((asset) => (
            <a
              key={asset.id}
              href={asset.browser_download_url}
              className={styles.assetLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={16} />
              <span className={styles.assetName}>{asset.name}</span>
              <span className={styles.assetSize}>
                {t('releases.size', { size: (asset.size / 1024 / 1024).toFixed(1) })}
              </span>
            </a>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          {t('releases.viewOnGithub')}
          <ExternalLink size={12} />
        </a>
      </div>
    </article>
  )
}

export default ReleaseCard
