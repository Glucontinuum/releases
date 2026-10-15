import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NativePreview } from '../services/native-preview'
import styles from './NativePreviewCarousel.module.css'

interface Props {
  preview: NativePreview
  theme: 'light' | 'dark'
  onUnavailable: () => void
}

export default function NativePreviewCarousel({ preview, theme, onUnavailable }: Props) {
  const { t } = useTranslation()
  const region = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden')
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [loadedSource, setLoadedSource] = useState<string | null>(null)
  const screen = preview.screens[index]
  const source = screen[theme]
  const multiple = preview.screens.length > 1
  const automatic = multiple && !paused && !reducedMotion && !hovered && !focused && visible && inView
  const name = t(`hero.screens.${screen.route}.name`)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motionChanged = () => setReducedMotion(preference.matches)
    const visibilityChanged = () => setVisible(document.visibilityState !== 'hidden')
    preference.addEventListener('change', motionChanged)
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      preference.removeEventListener('change', motionChanged)
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !region.current) return
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25)
    }, { threshold: [0, 0.25] })
    observer.observe(region.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!automatic || loadedSource !== source) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % preview.screens.length), 5000)
    return () => window.clearTimeout(timer)
  }, [automatic, loadedSource, source, preview.screens.length])

  useEffect(() => {
    if (!multiple || reducedMotion || !visible || !inView) return
    const nextImage = new Image()
    nextImage.src = preview.screens[(index + 1) % preview.screens.length][theme]
  }, [preview.screens, index, theme, multiple, reducedMotion, visible, inView])

  function move(offset: number) {
    setIndex((current) => (current + offset + preview.screens.length) % preview.screens.length)
  }

  return (
    <figure
      ref={region}
      className={styles.preview}
      role="region"
      aria-roledescription={t('hero.carouselRole')}
      aria-label={t('hero.carouselLabel')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      onKeyDown={(event) => {
        if (multiple && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          event.preventDefault()
          move(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}
    >
      <a href={source} className={styles.screenLink} target="_blank" rel="noopener noreferrer"
        aria-label={t('hero.previewOpen', { screen: name })}>
        <img key={source} src={source}
          alt={t('hero.previewAlt', { screen: name, theme: t(`hero.${theme}Theme`) })}
          width={preview.width} height={preview.height}
          style={{ aspectRatio: `${preview.width} / ${preview.height}` }}
          className={styles.screenImage} decoding="async"
          onLoad={() => setLoadedSource(source)} onError={onUnavailable} />
      </a>
      <figcaption className={styles.caption} aria-live={automatic ? 'off' : 'polite'} aria-atomic="true">
        <strong>{name}</strong>
        <span>{t(`hero.screens.${screen.route}.description`)}</span>
        <small>{t('hero.previewLabel')}</small>
      </figcaption>
      {multiple && <>
        <div className={styles.controls} role="group" aria-label={t('hero.carouselControls')}>
          <button type="button" onClick={() => move(-1)} aria-label={t('hero.previousScreen')} title={t('hero.previousScreen')}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <span>{t('hero.screenPosition', { current: index + 1, total: preview.screens.length })}</span>
          <button type="button" onClick={() => setPaused((current) => !current)} disabled={reducedMotion}
            aria-label={t(paused || reducedMotion ? 'hero.playCarousel' : 'hero.pauseCarousel')}
            title={t(reducedMotion ? 'hero.reducedMotion' : paused ? 'hero.playCarousel' : 'hero.pauseCarousel')}>
            {paused || reducedMotion ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => move(1)} aria-label={t('hero.nextScreen')} title={t('hero.nextScreen')}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.indicators} role="group" aria-label={t('hero.chooseScreen')}>
          {preview.screens.map((item, position) => <button key={item.route} type="button"
            aria-label={t('hero.showScreen', { screen: t(`hero.screens.${item.route}.name`) })}
            aria-current={position === index ? 'true' : undefined}
            title={t(`hero.screens.${item.route}.name`)} onClick={() => setIndex(position)}>
            <span aria-hidden="true" />
          </button>)}
        </div>
      </>}
    </figure>
  )
}
