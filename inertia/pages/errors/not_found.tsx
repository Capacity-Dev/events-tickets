import { useTranslation } from '~/lib/i18n'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <>
      <h1>{t('error.page_not_found')}</h1>
    </>
  )
}
