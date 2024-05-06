const cards = document.querySelectorAll('.memory-card');
const triesCounter = document.querySelector('#tries-counter');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let tries = 0;

function updateTriesCounter() {
  triesCounter.textContent = `Tries: ${tries}`;
}

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

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));
updateTriesCounter();

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
  
    checkGameCompletion();
    resetBoard();
  }
  
  function checkGameCompletion() {
    // Check if all cards have been matched
    const allCards = document.querySelectorAll('.memory-card');
    const allFlipped = [...allCards].every(card => card.classList.contains('flip'));
  
    if (allFlipped) {
      // Show congratulation message
      const congratulationMessage = document.getElementById('congratulation-message');
      congratulationMessage.style.display = 'block';
    }
  }