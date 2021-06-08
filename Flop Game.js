// MVC架構View
const view = {
  // 因為Key跟Value同名子所以把 displayCards: function displayCards() { ...  }改寫如下
  displayCards() {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = this.getCardElement()
  },
  getCardElement() {
    return `
    <div class="card">
      <!--左上數字-->
      <p>4</p>
      <!-- 中間花色 -->
      <img src="https://image.flaticon.com/icons/svg/105/105223.svg" alt="">
      <!--右下數字-->
      <p>4</p>
    </div>`
  }
}
view.displayCards()