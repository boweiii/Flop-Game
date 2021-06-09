const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]
// MVC架構View
const view = {
  // 因為Key跟Value同名子所以把 displayCards: function displayCards() { ...  }改寫如下
  displayCards() {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join('')
  },
  getCardElement(index) {
    const number = this.transformNumber((index % 13) + 1) //將特定字符用transformNumber過濾替換為英文字母
    const symbol = Symbols[Math.floor(index / 13)]
    return `
    <div class="card">
      <!--左上數字-->
      <p>${number}</p>
      <!-- 中間花色 -->
      <img src=${symbol} alt="">
      <!--右下數字-->
      <p>${number}</p>
    </div>`
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
  }
}

const utility = {
  // 洗牌演算法
  getRandomNumberArray(count) {
    //0~count 的陣列
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



view.displayCards()