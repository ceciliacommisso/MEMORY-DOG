// Function to fetch a random image from the API
async function fetchRandomImage() {
    const response = await fetch('https://placedog.net/500/500');
    return response.url;
}

// Function to update the images on all the memory cards
async function updateCardImages() {
    const cards = document.querySelectorAll('.memory-card .front-face');
    console.log(cards);
    const uniqueImages = [];

    // Ensure we have 6 unique images for the 6 pairs
    while (uniqueImages.length < 6) {
        const imageUrl = await fetchRandomImage();
        if (!uniqueImages.includes(imageUrl)) {
            uniqueImages.push(imageUrl);
        }
    }

    // Assign images to cards, each image to two cards for the pairs
    cards.forEach((card, index) => {
        const imageIndex = Math.floor(index / 2);
        card.src = uniqueImages[imageIndex];
        card.alt = `Dog ${imageIndex + 1}`;
    });
}

// Call the function to update the images on document load
document.addEventListener('DOMContentLoaded', updateCardImages);