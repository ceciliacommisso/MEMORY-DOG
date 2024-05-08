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
  updateCardImages();
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


// Function to fetch a random image from the API
async function fetchRandomImage(randomID) {
  const response = await fetch(`https://placedog.net/500/${randomID}`);
  return response.url;
}

// Function to update the images on all the memory cards
async function updateCardImages() {
  const cards = document.querySelectorAll('.memory-card .front-face');
  const uniqueImages = [];
  console.log(uniqueImages);
  // Ensure we have 6 unique images for the 6 pairs
  for (let i = 0; i < 6; i++) {
    let randomID = Math.floor(Math.random() * 1000);
    const imageUrl = await fetchRandomImage(randomID);
    uniqueImages.push(imageUrl);
  }
  
  console.log(uniqueImages);
  // Assign images to cards, each image to two cards for the pairs
  cards.forEach((card, index) => {
    const imageIndex = Math.floor(index / 2);
    card.src = uniqueImages[imageIndex];
    card.alt = `Dog ${imageIndex + 1}`;
  });
}

// Call the function to update the images on document load
document.addEventListener('DOMContentLoaded', updateCardImages);