import { useTranslation } from '~/lib/i18n'

export default function Home() {
  const { t } = useTranslation()
  return (
    <>
      <div className="hero">
        <h1>{t('home.hero_title')}</h1>
        <p>{t('home.hero_subtitle')}</p>
      </div>

      <div className="cards">
        <a href="/events" target="_blank" rel="noreferrer">
          <h3>{t('home.card_events_title')} &nbsp;&rsaquo;</h3>
          <p>{t('home.card_events_desc')}</p>
        </a>

        <a href="/signup" target="_blank" rel="noreferrer">
          <h3>{t('home.card_signup_title')} &nbsp;&rsaquo;</h3>
          <p>{t('home.card_signup_desc')}</p>
        </a>

        <a href="/dashboard" target="_blank" rel="noreferrer">
          <h3>{t('home.card_dashboard_title')} &nbsp;&rsaquo;</h3>
          <p>{t('home.card_dashboard_desc')}</p>
        </a>
      </div>
    </>
  )
}
