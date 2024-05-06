// Select all memory cards and the tries counter
const cards = document.querySelectorAll('.memory-card');
const triesCounter = document.querySelector('#tries-counter');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let tries = 0;

// Update the tries counter
function updateTriesCounter() {
  triesCounter.textContent = `Tries: ${tries}`;
}

// Flip the selected card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  tries += 1;
  updateTriesCounter();
  checkForMatch();
}

// Check if the selected cards are a match
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

// Disable click events for matched cards
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  checkGameCompletion();
  resetBoard();
}

// Check if all cards are flipped
function checkGameCompletion() {
  const allFlipped = [...cards].every(card => card.classList.contains('flip'));
  if (allFlipped) {
    const congratulationMessage = document.getElementById('congratulation-message');
    congratulationMessage.style.display = 'block';
  }
}

// Unflip the selected cards after a delay
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

// Reset the board variables
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Shuffle the memory cards
function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

// Reset the game
function resetGame() {
  cards.forEach(card => card.classList.remove('flip'));
  tries = 0;
  updateTriesCounter();
  cards.forEach(card => card.addEventListener('click', flipCard));
  document.getElementById('congratulation-message').style.display = 'none';
  shuffle();
}

// Add event listeners to cards and restart button
cards.forEach(card => card.addEventListener('click', flipCard));
document.getElementById('restart-btn').addEventListener('click', resetGame);

// Shuffle cards initially and update tries counter
shuffle();
updateTriesCounter();
