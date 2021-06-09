const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}
// MVC架構View
const view = {
  // 因為Key跟Value同名子所以把 displayCards: function displayCards() { ...  }改寫如下
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  },
  getCardElement(index) {
    return `
    <div data-index=${index} class="card back">

    </div>`
  },
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1) //將特定字符用transformNumber過濾替換為英文字母
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <!--左上數字-->
      <p>${number}</p>
      <!-- 中間花色 -->
      <img src=${symbol} alt="">
      <!--右下數字-->
      <p>${number}</p>`
  },

  // 我的 transformNumber 寫法
  // transformNumber(number) {
  //   if (number === 1) {
  //     return 'A'
  //   } else if (number === 11) {
  //     return 'J'
  //   } else if (number === 12) {
  //     return 'Q'
  //   } else if (number === 13) {
  //     return 'K'
  //   } else {
  //     return number
  //   }
  // }

  // AC 的 transformNumber 寫法
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  flipCard(card) {
    if (card.classList.contains('back')) {
      // 回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
    } else {
      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
    }
  }
}

const utility = {
  // 洗牌演算法
  getRandomNumberArray(count) {
    //0~count-1 的陣列
    const number = Array.from(Array(count).keys())
    //由最後一張開始向前迭代 1.第51張 2.第50張...
    for (let index = number.length - 1; index >= 0; index--) {
      // 隨機選出陣列中的一個位置
      randomIndex = Math.floor(Math.random() * (index + 1));
      //目前迭代到的卡片跟隨機選到的位置交換(解構賦值)
      [number[randomIndex], number[index]] = [number[index], number[randomIndex]]
    }
    return number
  }
}

// MVC架構Controll
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  }
}

// MVC架構Model
const model = {
  // revealedCards 代表「被翻開的卡片」
  // revealedCards是一個暫存牌組，使用者每次翻牌時，就先把卡片丟進這個牌組，集滿兩張牌時就要檢查配對有沒有成功，檢查完以後，這個暫存牌組就需要清空
  revealedCards: []
}

// 不要讓 controller 以外的內部函式暴露在 global 的區域，一律用controller呼叫
controller.generateCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    view.flipCard(card)
  })
})