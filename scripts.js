// Wählen Sie alle Memory-Karten und den Versuchs-Zähler aus
const cards = document.querySelectorAll('.memory-card');
const triesCounter = document.querySelector('#tries-counter');

let hasFlippedCard = false; // Gibt an, ob eine Karte umgedreht wurde
let lockBoard = false; // Sperrt das Brett, um mehrere Klicks zu verhindern
let firstCard, secondCard; // Hält die Referenzen zu den beiden umgedrehten Karten
let tries = 0; // Zählt die Anzahl der Versuche

// Aktualisiert den Versuchs-Zähler
function updateTriesCounter() {
  triesCounter.textContent = `Tries: ${tries}`;
}

// Dreht die ausgewählte Karte um
function flipCard() {
  if (lockBoard) return; // Verhindert weitere Klicks, wenn das Board gesperrt ist
  if (this === firstCard) return; // Verhindert das Umdrehen derselben Karte

  this.classList.add('flip'); // Fügen Sie der Karte die 'flip'-Klasse hinzu, um sie zu drehen

  if (!hasFlippedCard) {
    // Überprüfen Sie, ob dies die erste Karte ist, die umgedreht wurde
    hasFlippedCard = true;
    firstCard = this; // Speichern Sie diese Karte als 'firstCard'
    return;
  }

  // Wenn eine Karte bereits umgedreht wurde, speichern Sie diese Karte als 'secondCard'
  secondCard = this;
  tries += 1; // Erhöhen Sie die Anzahl der Versuche
  updateTriesCounter(); // Aktualisieren Sie den Versuchs-Zähler
  checkForMatch(); // Überprüfen Sie, ob die Karten übereinstimmen
}

// Überprüft, ob die ausgewählten Karten übereinstimmen
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  // Überprüfen Sie, ob die Datenattribute der beiden Karten übereinstimmen
  isMatch ? disableCards() : unflipCards();
}

// Deaktiviert Klick-Events für passende Karten
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  checkGameCompletion(); // Überprüfen Sie, ob das Spiel abgeschlossen ist
  resetBoard(); // Setzen Sie das Brett zurück
}

// Überprüft, ob alle Karten umgedreht sind
function checkGameCompletion() {
  const allFlipped = [...cards].every(card => card.classList.contains('flip'));
  // Überprüfen Sie, ob jede Karte umgedreht ist
  if (allFlipped) {
    const congratulationMessage = document.getElementById('congratulation-message');
    congratulationMessage.style.display = 'block'; // Zeigen Sie die Erfolgsmeldung an
  }
}

// Dreht die ausgewählten Karten nach einer Verzögerung um
function unflipCards() {
  lockBoard = true; // Sperrt das Brett, um weitere Klicks zu verhindern
  setTimeout(() => {
    // Entfernen Sie die 'flip'-Klasse, um die Karten wieder umzudrehen
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard(); // Setzen Sie das Brett zurück
  }, 1500); // 1,5 Sekunden Verzögerung
}

// Setzt die Board-Variablen zurück
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Mischt die Memory-Karten
function shuffle() {
  cards.forEach(card => {
    // Generieren Sie eine zufällige Position für jede Karte
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos; // Setzen Sie den CSS-Order-Wert
  });
}

// Setzt das Spiel zurück
function resetGame() {
  cards.forEach(card => card.classList.remove('flip')); // Dreht alle Karten um
  tries = 0; // Setzen Sie die Versuche zurück
  updateTriesCounter(); // Aktualisieren Sie den Versuchs-Zähler
  cards.forEach(card => card.addEventListener('click', flipCard)); // Fügen Sie Klick-Events zu jeder Karte hinzu
  document.getElementById('congratulation-message').style.display = 'none'; // Verstecken Sie die Erfolgsmeldung
  shuffle(); // Mischen Sie die Karten
}

// Fügen Sie Karten- und Restart-Button-Event-Listener hinzu
cards.forEach(card => card.addEventListener('click', flipCard));
document.getElementById('restart-btn').addEventListener('click', resetGame);

// Mischen Sie Karten zunächst und aktualisieren Sie den Versuchs-Zähler
shuffle();
updateTriesCounter();
