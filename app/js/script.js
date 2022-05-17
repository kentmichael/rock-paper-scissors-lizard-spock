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

  pick() {
    const randomPick = Math.floor(Math.random() * 5)
    const picked = super.options.find((el, id) => id === randomPick)
    return picked
  }
}

class User extends Player {
  _score = 0

  constructor(btnPick, value = 0) {
    super()
    this.score = { value, operation: "add" }
    this.btnPick = btnPick
    this.btnPick.addEventListener("click", (event) => this.pick(event))
  }

  pick(event) {
    if (event.target.matches(".pick")) {
      const choice = event.target.dataset.value
      switch (decideWinner(choice)) {
        case "Win":
          this.score = { value: 1, operation: "add" }
          break
        case "Lose":
          this.score = { value: 1, operation: "minus" }
          break
      }
      console.log(this.score)
    }
  }

  get score() {
    return this._score
  }

  set score({ value, operation }) {
    if (operation === "add") this._score = this.score + value
    else this._score = this.score ? this.score - value : 0
  }
}

const btnPick = document.querySelector("main")
const computer = new Computer()
const user = new User(btnPick)

function decideWinner(userPick) {
  const computerPick = computer.pick()
  let status = "Draw"
  console.log(userPick)
  console.log(computerPick)

  if (userPick !== computerPick.type) {
    status = computerPick.beats.includes(userPick) ? "Lose" : "Win"
  }

  showEndState({ status, computerPick: computerPick.type, userPick })
  return status
}

function showEndState({ status, computerPick, userPick }) {
  console.log(status)
  const playAgain = document.querySelectorAll(".play-again")
  const appDefaultState = document.querySelector(".start")
  const appEndState = document.querySelector(".end")
  const user = document.querySelector("#user")
  const computer = document.querySelector("#computer")
  const result = document.querySelectorAll(".result")
  const header = document.querySelector("header")

  playAgain.forEach((element) => {
    element.addEventListener("click", () => {
      appDefaultState.classList.remove("hide")
      appEndState.classList.add("hide")
      user.setAttribute("class", "")
      computer.setAttribute("class", "")
    })
  })

  appDefaultState.classList.add("hide")
  appEndState.classList.remove("hide")
  user.classList.add(`end__blk1--${userPick}`)
  computer.classList.add(`end__blk1--${computerPick}`)
  result.forEach(
    (element) =>
      (element.innerText = status === "Draw" ? "Draw" : `You ${status}`)
  )
  header.classList.add("header__endState")
}
