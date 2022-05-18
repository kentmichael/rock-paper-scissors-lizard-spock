"use-strict"

const btnRulesModal = document.querySelector("#rules-btn")

btnRulesModal.addEventListener("click", () => {
  checkModalStatus()
})

const checkModalStatus = () => {
  if (document.querySelector(".rules"))
    document.querySelector(".rules").remove()
  else createModal()
}

const createModal = () => {
  const dialog = document.createElement("dialog")
  const h2 = document.createElement("h2")
  const closeBtn = document.createElement("button")

  dialog.classList.add("rules")
  h2.innerText = "Rules"
  closeBtn.id = "close-btn"
  closeBtn.setAttribute("aria-label", "Close")
  dialog.append(h2, closeBtn)
  document.body.appendChild(dialog)
  closeBtn.addEventListener("click", () => {
    dialog.close()
    dialog.remove()
    document.body.classList.remove("fixed")
  })
  dialog.showModal()
  document.body.classList.add("fixed")
}

class Player {
  _options = [
    {
      type: "scissors",
      beats: ["paper", "lizard"],
    },
    {
      type: "paper",
      beats: ["rock", "spock"],
    },
    {
      type: "rock",
      beats: ["lizard", "scissors"],
    },
    {
      type: "lizard",
      beats: ["spock", "paper"],
    },
    {
      type: "spock",
      beats: ["scissors", "rock"],
    },
  ]

  get options() {
    return this._options
  }
}

class Computer extends Player {
  constructor() {
    super()
  }

  randomPick() {
    const randomPick = Math.floor(Math.random() * 5)
    const picked = super.options.find((el, id) => id === randomPick)
    return picked
  }
}

class User extends Player {
  _score = 0

  constructor(btnPick, gameData = 0) {
    super()
    this.score = { initialLoad: true, operation: "add", value: gameData }
    this.btnPick = btnPick
    this.btnPick.addEventListener("click", (event) => this.pick(event))
    updateScore(this.score)
  }

  pick(event) {
    if (event.target.matches(".pick")) {
      const choice = event.target.dataset.value
      const userPick = super.options.find((el) => el.type === choice)
      switch (decideWinner(userPick)) {
        case "Win":
          this.score = { initialLoad: false, operation: "add" }
          break
        case "Lose":
          this.score = { initialLoad: false, operation: "minus" }
          break
      }
    }
  }

  get score() {
    return this._score
  }

  set score({ initialLoad, operation, value = 1 }) {
    if (operation === "add") this._score = this.score + value
    else this._score = this.score ? this.score - value : 0
    updateScore(this.score, initialLoad)
    localStorage.setItem("RPSLS_Game_Score", this.score)
  }
}

const gameData = Number(localStorage.getItem("RPSLS_Game_Score")) ?? 0
const btnPick = document.querySelector("main")
const computer = new Computer()
const user = new User(btnPick, gameData)

function decideWinner(userPick) {
  const computerPick = computer.randomPick()
  let status = "Draw"

  if (userPick.type !== computerPick.type) {
    status = computerPick.beats.includes(userPick.type) ? "Lose" : "Win"
  }

  showEndState({
    status,
    computerPick: computerPick.type,
    userPick: userPick.type,
  })
  return status
}

function showEndState({ status, computerPick, userPick }) {
  const playAgain = document.querySelectorAll(".play-again")
  const appDefaultState = document.querySelector(".start")
  const appEndState = document.querySelector(".end")
  const user = document.querySelector("#user")
  const computer = document.querySelector("#computer")
  const result = document.querySelectorAll(".result")
  const header = document.querySelector("header")
  const mobileResult = document.querySelector(".end__blk2")
  const desktopWidth = document.querySelector(".end")
  const desktopResult = document.querySelector(".end__blk1--result")

  playAgain.forEach((element) => {
    element.addEventListener("click", () => {
      appDefaultState.classList.remove("hide")
      appEndState.classList.add("hide")
      header.classList.remove("header__endState")
      user.setAttribute("class", "")
      computer.setAttribute("class", "")
    })
  })

  appDefaultState.classList.add("hide")
  appEndState.classList.remove("hide")
  header.classList.add("header__endState")
  user.classList.add(`end__blk1--${userPick}`)
  computer.classList.add(`end__blk1--picking`)
  mobileResult.classList.add("transition")
  desktopResult.classList.add("transition")
  desktopWidth.classList.add("desktop-width")

  setTimeout(() => {
    computer.classList.remove(`end__blk1--picking`)
    computer.classList.add(`end__blk1--${computerPick}`)
  }, 700)

  setTimeout(() => {
    if (status !== "Draw") {
      status === "Win"
        ? user.classList.add("winner")
        : computer.classList.add("winner")
    }
    mobileResult.classList.remove("transition")
    desktopResult.classList.remove("transition")
    desktopWidth.classList.remove("desktop-width")
  }, 1100)

  result.forEach(
    (element) =>
      (element.innerText = status === "Draw" ? "Draw" : `You ${status}`)
  )
}

function updateScore(score, initialLoad) {
  const scoreBoard = document.querySelector("#score-board")
  if (!initialLoad)
    return setTimeout(() => (scoreBoard.innerText = score), 1800)
  scoreBoard.innerText = score
}
