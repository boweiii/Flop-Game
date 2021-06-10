const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
// 遊戲狀態機
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
    console.log(indexes)
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  },
  // 取得牌外層
  getCardElement(index) {
    return `
    <div data-index=${index} class="card back">

    </div>`
  },
  // 取得牌內部內容
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
  // 翻牌
  flipCards(...cards) {
    cards.forEach(card => {
      if (card.classList.contains('back')) {
        // 回傳正面
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
      } else {
        // 回傳背面
        card.classList.add('back')
        card.innerHTML = null
      }
    })
  },
  // 配對成功加入CSS
  pairCards(...cards) {
    cards.forEach(card => {
      card.classList.add('paired')
    })
  },
  //顯示分數
  renderScore(score) {
    document.querySelector(".score").innerHTML = `Score: ${score}`;
  },
  //顯示嘗試次數
  renderTriedTimes(times) {
    document.querySelector(".tried").innerHTML = `You've tried: ${times} times`;
  },
  // 配對錯誤動畫
  appendWrongAnimation(...cards) {
    cards.forEach(card => {
      card.classList.add('wrong')
      // 動畫結束後清除className
      // { once: true } 是要求在事件執行一次之後，就要卸載這個監聽器
      card.addEventListener('animationend', () => {
        card.classList.remove('wrong')
      }, { once: true })
    })
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
  // 設定初始狀態
  currentState: GAME_STATE.FirstCardAwaits,
  // 發牌
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  // 遊戲流程
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {

      case GAME_STATE.FirstCardAwaits:
        //翻牌
        view.flipCards(card)
        // 將選到的卡片加入 revealedCards
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break

      case GAME_STATE.SecondCardAwaits:
        // 嘗試次數+1
        view.renderTriedTimes(model.triedTimes += 1)
        //翻牌
        view.flipCards(card)
        // 將選到的卡片加入 revealedCards
        model.revealedCards.push(card)
        // 判斷配對是否成功
        console.log(model.isRevealCadrsMatched())
        if (model.isRevealCadrsMatched()) {
          // 配對成功
          // 分數+10
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          // 清空revealedCards
          model.revealedCards.length = 0
          // 設定回初始狀態
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000)
        }
        break
    }
    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    // 清空revealedCards
    model.revealedCards.length = 0
    // 設定回初始狀態
    controller.currentState = GAME_STATE.FirstCardAwaits //這裡不能用this.currentState,this 的對象變成了 setTimeout, 所以要用controller
  }
}

// MVC架構Model
const model = {
  // revealedCards 代表「被翻開的卡片」
  // revealedCards是一個暫存牌組，使用者每次翻牌時，就先把卡片丟進這個牌組，集滿兩張牌時就要檢查配對有沒有成功，檢查完以後，這個暫存牌組就需要清空
  revealedCards: [],
  isRevealCadrsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },
  // 分數
  score: 0,
  // 嘗試次數
  triedTimes: 0
}

// 不要讓 controller 以外的內部函式暴露在 global 的區域，一律用controller呼叫
controller.generateCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    controller.dispatchCardAction(card)
  })
})