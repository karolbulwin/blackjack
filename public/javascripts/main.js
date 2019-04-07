(function bjGame() {
  function createCardElement(card) {
    const cardDiv = document.createElement('div');
    const cardInner = document.createElement('div');
    const front = document.createElement('div');
    const back = document.createElement('div');
    const suit = document.createElement('div');
    const value = document.createElement('div');
    suit.innerText = card.suit;
    value.innerText = card.value;
    cardDiv.classList.add('card');

    cardInner.classList.add('card-inner');

    front.classList.add('front');
    front.append(suit);
    front.append(value);

    back.classList.add('back');

    cardInner.append(front);
    cardInner.append(back);

    cardDiv.append(cardInner);

    return cardDiv;
  }

  function addCardToBoard(player, card) {
    const elCard = createCardElement(card);
    document.querySelector(`.${player.toLowerCase()}`).append(elCard);
  }

  function showScores(player, score) {
    document.querySelector(`#${player.toLowerCase()}-score`).innerText = score;
  }

  function flipDealerCard(position) {
    const card = document.querySelector('.card-inner');
    if (position === false) {
      card.classList.add('flipped');
    } else {
      card.classList.remove('flipped');
    }
  }

  class Card {
    constructor(suit, value) {
      this.suit = suit;
      this.value = value;
      this.is_face_up = true;
    }

    flip() {
      if (this.is_face_up === false) {
        this.is_face_up = true;
      } else {
        this.is_face_up = false;
      }
    }

    getNumValue() {
      let value = 0;
      if (this.is_face_up) {
        switch (this.value) {
          case 'Ace':
            value = 1;
            break;
          case 'Two':
            value = 2;
            break;
          case 'Three':
            value = 3;
            break;
          case 'Four':
            value = 4;
            break;
          case 'Five':
            value = 5;
            break;
          case 'Six':
            value = 6;
            break;
          case 'Seven':
            value = 7;
            break;
          case 'Eight':
            value = 8;
            break;
          case 'Nine':
            value = 9;
            break;
          default:
            value = 10;
            break;
        }
      }
      return value;
    }

    checkIfAce() {
      let isAce = false;
      if (this.value === 'Ace') {
        isAce = true;
      }
      return isAce;
    }

    getPoition() {
      return this.is_face_up;
    }
  }

  class Player {
    constructor() {
      this.name = 'Player';
      this.cards = [];
      this.isHitting = false;
      this.score = 0;
    }

    clear() {
      this.cards = [];
    }

    getCardsValue() {
      let cardsValue = 0;
      this.cards.forEach((card) => {
        cardsValue += card.getNumValue();
      });
      this.cards.forEach((card) => {
        if (card.checkIfAce() && cardsValue <= 11) {
          cardsValue += 10;
        }
      });
      return cardsValue;
    }

    addCard(card) {
      this.cards.push(card);
      addCardToBoard(this.name, card);
    }

    updateScores() {
      this.score = this.getCardsValue();
      showScores(this.name, this.score);
    }

    getScore() {
      return this.score;
    }

    itsTurn(card) {
      this.addCard(card);
      this.updateScores();
    }

    isBusted() {
      return this.getCardsValue() > 21;
    }

    setIsHitting() {
      this.isHitting = true;
    }

    checkIfIsHitting() {
      return this.isHitting;
    }

    resetHitting() {
      this.isHitting = false;
    }
  }

  class Dealer extends Player {
    constructor() {
      super();
      this.name = 'Dealer';
    }

    needToHit() {
      return this.getCardsValue() < 17;
    }

    flipFirstCard() {
      this.cards[0].flip();
      flipDealerCard(this.cards[0].getPoition());
      this.updateScores();
    }
  }

  class Deck extends Player {
    constructor() {
      super();
      this.name = 'Deck';
      this.suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
      this.values = ['Ace', 'King', 'Queen', 'Jack',
        'Ten', 'Nine', 'Eight', 'Seven', 'Six',
        'Five', 'Four', 'Three', 'Two'];
    }

    addCards() {
      this.suits.forEach((suit) => {
        this.values.forEach((value) => {
          const card = new Card(suit, value);
          this.cards.push(card);
        });
      });
    }

    shuffleDeck() {
      this.cards.sort((a, b) => 0.5 - Math.random());
    }

    giveCard(otherPlayer) {
      const card = this.cards.shift();
      otherPlayer.itsTurn(card);
    }

    deal(players, perHand = 1) {
      for (let i = 0; i < perHand; i += 1) {
        players.forEach(player => this.giveCard(player));
      }
    }
  }

  class BjGame {
    constructor() {
      this.player = new Player();
      this.dealer = new Dealer();
      this.deck = new Deck();
      this.players = [this.player, this.dealer];
    }

    play() {
      this.deck.addCards();
      this.deck.shuffleDeck();
      this.deck.deal(this.players, 2);
      this.dealer.flipFirstCard();
    }

    additionalCard(player) {
      if (!player.isBusted() && player.checkIfIsHitting()) {
        this.deck.giveCard(player);
      }
    }

    resetGame() {
      this.players.forEach(player => player.clear());
      this.deck.clear();
    }
  }

  const game = new BjGame();


  function clearDeck() {
    document.querySelectorAll('.card').forEach(card => card.remove());
  }

  function hideButtons() {
    document.querySelector('#hit-btn').classList.add('hidden');
    document.querySelector('#stay-btn').classList.add('hidden');
  }

  function showButtons() {
    document.querySelector('#hit-btn').classList.remove('hidden');
    document.querySelector('#stay-btn').classList.remove('hidden');
  }

  function hideNewGameButton() {
    document.querySelector('#new-btn').classList.add('hidden');
  }

  function showNewGameButton() {
    document.querySelector('#new-btn').classList.remove('hidden');
  }

  function showInfo(msg) {
    document.querySelector('#text-area').innerText = msg;
  }

  function clearInfo() {
    document.querySelector('#text-area').innerText = '';
  }

  function newGame() {
    showButtons();
    hideNewGameButton();
    clearInfo();
  }

  function endOfGame() {
    hideButtons();
    showNewGameButton();
  }

  function itsTurn(player) {
    player.setIsHitting();
    game.additionalCard(player);
    player.resetHitting();
  }

  function checkWhoWon() {
    if (game.dealer.isBusted()) {
      endOfGame();
      showInfo('Player Wins!');
    } else if (game.dealer.getScore() <= 21
    && game.dealer.getScore() < game.player.getScore()) {
      endOfGame();
      showInfo('Player Wins!');
    } else if (game.dealer.getScore() <= 21
    && game.dealer.getScore() > game.player.getScore()) {
      endOfGame();
      showInfo('Dealer Wins!');
    } else if (game.dealer.getScore() === game.player.getScore()) {
      endOfGame();
      showInfo('Tie!');
    }
  }

  document.querySelector('#hit-btn').onclick = () => {
    itsTurn(game.player);
    if (game.player.isBusted()) {
      endOfGame();
      game.dealer.flipFirstCard();
      showInfo('Dealer Wins!');
    }
  };

  document.querySelector('#stay-btn').onclick = () => {
    game.dealer.flipFirstCard();
    while (!game.player.isBusted() && game.dealer.needToHit()) {
      if (game.dealer.cards.length < 5) {
        itsTurn(game.dealer);
      } else {
        break;
      }
    }
    while (!game.player.isBusted() && game.dealer.getScore() < game.player.getScore()) {
      if (game.dealer.cards.length < 5) {
        itsTurn(game.dealer);
      } else {
        break;
      }
    }
    checkWhoWon();
  };

  document.querySelector('#new-btn').onclick = () => {
    document.querySelector('.dealer + div').classList.remove('opacity-0');
    document.querySelector('.player + div').classList.remove('opacity-0');
    game.resetGame();
    clearDeck();
    game.play();
    newGame();
  };

  /**/
  (function intro() {
    setTimeout(() => document.querySelector('h1').classList.add('opacity-0'), 1000);
    setTimeout(() => document.querySelector('h1').classList.add('hidden'), 2900);
    setTimeout(() => document.querySelector('.container').classList.remove('opacity-0'), 2800);
  }());
}());