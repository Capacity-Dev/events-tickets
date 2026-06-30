import { useTranslation } from '~/lib/i18n'

export default function ServerError() {
  const { t } = useTranslation()
  return (
    <>
      <h1>{t('error.something_went_wrong')}</h1>
    </>
  )
}
