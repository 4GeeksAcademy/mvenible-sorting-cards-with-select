import "bootstrap";
import "./style.css";


import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";

const suits = ["♠", "♥", "♦", "♣"]; 
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

let currentCards = [];
let sortingLog = [];

function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function getSuitColor(suit) {
  // Hearts ♥ & Diamonds ♦ (red)
  // Spades ♠ & Clubs ♣ (black)
  return (suit === "♥" || suit === "♦") ? "red-suit" : "black-suit";
}

function getCardValue(card) {
  if (card.value === "J") return 11;
  if (card.value === "Q") return 12;
  if (card.value === "K") return 13;
  if (card.value === "A") return 14;
  return parseInt(card.value);
}

function generateRandomCards(count) {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const suit = getRandomItem(suits);
    const value = getRandomItem(values);
    cards.push({
      suit: suit,
      value: value,
      color: getSuitColor(suit)
    });
  }
  return cards;
}

function createCardHTML(card, index) {
  return `
    <div class="card" id="card-${index}">
      <span class="card-top-suit ${card.color}">${card.suit}</span>
      <span class="card-number ${card.color}">${card.value}</span>
      <span class="card-bottom-suit ${card.color}">${card.suit}</span>
    </div>
  `;
}

function createSmallCardHTML(card, index) {
  return `
    <div class="small-card">
      <span class="small-card-top-suit ${card.color}">${card.suit}</span>
      <span class="small-card-number ${card.color}">${card.value}</span>
      <span class="small-card-bottom-suit ${card.color}">${card.suit}</span>
    </div>
  `;
}

function createCardsDisplay(cards, label) {
  const cardsHTML = cards.map((card, index) => createSmallCardHTML(card, index)).join('');
  return `
    <div class="step-cards-row">
      <span class="step-label">${label}:</span>
      <div class="step-cards">${cardsHTML}</div>
    </div>
  `;
}

function displayCards(cards) {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';
  
  cards.forEach((card, index) => {
    container.innerHTML += createCardHTML(card, index);
  });
}

function increaseCards() {
  const display = document.getElementById('cardCount');
  let count = parseInt(display.textContent);
  
  if (count < 20) {
    count++;
    display.textContent = count;
    updateArrowButtons(count);
  }
}

function decreaseCards() {
  const display = document.getElementById('cardCount');
  let count = parseInt(display.textContent);
  
  if (count > 1) {
    count--;
    display.textContent = count;
    updateArrowButtons(count);
  }
}

function updateArrowButtons(count) {
  const decreaseBtn = document.getElementById('decreaseBtn');
  const increaseBtn = document.getElementById('increaseBtn');
  
  decreaseBtn.disabled = (count <= 1);
  
  increaseBtn.disabled = (count >= 20);
}

function drawCards() {
  const count = parseInt(document.getElementById('cardCount').textContent);
  
  if (!count || count < 1 || count > 20) {
    alert('Invalid number of cards');
    return;
  }

  currentCards = generateRandomCards(count);
  
  displayCards(currentCards);
  
  document.getElementById('sortBtn').disabled = false;
  document.getElementById('sortingSteps').style.display = 'none';
  sortingLog = [];
  
  console.log('Generated cards:', currentCards);
}

function selectionSort(cards) {
  const arr = [...cards]; 
  const steps = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (getCardValue(arr[j]) < getCardValue(arr[minIndex])) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      const step = {
        stepNumber: steps.length + 1,
        action: `Swapped ${arr[i].value}${arr[i].suit} with ${arr[minIndex].value}${arr[minIndex].suit}`,
        beforeSwap: [...arr],
        afterSwap: null
      };
      
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      step.afterSwap = [...arr];
      
      steps.push(step);
    }
  }
  
  return { sortedCards: arr, steps: steps };
}

function sortCards() {
  if (currentCards.length === 0) {
    alert('Please draw some cards first!');
    return;
  }

  const result = selectionSort(currentCards);
  
  currentCards = result.sortedCards;
  sortingLog = result.steps;
  
  displayCards(currentCards);
  
  displaySortingSteps();
  
  console.log('Sorting completed!', result);
}

function displaySortingSteps() {
  const stepsContainer = document.getElementById('stepsContainer');
  const sortingSteps = document.getElementById('sortingSteps');
  
  if (sortingLog.length === 0) {
    stepsContainer.innerHTML = '<p>No swaps were needed - cards were already sorted!</p>';
  } else {
    stepsContainer.innerHTML = '';
    
    sortingLog.forEach((step, index) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step';
      
      stepDiv.innerHTML = `
        <div class="step-number">Step ${step.stepNumber}:</div>
        <div class="step-action">${step.action}</div>
        ${createCardsDisplay(step.beforeSwap, 'Before')}
        ${createCardsDisplay(step.afterSwap, 'After')}
      `;
      
      stepsContainer.appendChild(stepDiv);
    });
  }
  
  sortingSteps.style.display = 'block';
}

window.drawCards = drawCards;
window.sortCards = sortCards;
window.increaseCards = increaseCards;
window.decreaseCards = decreaseCards;

window.onload = function() {
  console.log("Multi-Card Generator loaded!");

  updateArrowButtons(5);
};