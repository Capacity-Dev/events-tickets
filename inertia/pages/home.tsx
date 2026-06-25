export default function Home() {
  return (
    <>
      <div className="hero">
        <h1>Bienvenue sur Mbiyo Events</h1>
        <p>Votre plateforme de billetterie événementielle — rapide, sécurisée et sans friction.</p>
      </div>

      <div className="cards">
        <a href="/events" target="_blank" rel="noreferrer">
          <h3>Événements &nbsp;›</h3>
          <p>Parcourez les événements disponibles</p>
        </a>

        <a href="/signup" target="_blank" rel="noreferrer">
          <h3>Créer un compte &nbsp;›</h3>
          <p>Organisez vos propres événements</p>
        </a>

        <a href="/dashboard" target="_blank" rel="noreferrer">
          <h3>Tableau de bord &nbsp;›</h3>
          <p>Gérez vos événements et vos billets</p>
        </a>
      </div>
    </>
  )
}
