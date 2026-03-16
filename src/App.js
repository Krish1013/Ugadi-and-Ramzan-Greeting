import React, {Component} from 'react'
import './App.css'
import html2canvas from 'html2canvas'

class UgadiGreeting extends Component {
  state = {
  // TODO 1: add all required state values
  // name with empty string
  name: '',
  // festival with empty string
  festival: '',
  // card with null
  card: null,
  // history from localStorage or empty array
  history: JSON.parse(localStorage.getItem('greetingHistory')) || [],
  // step with 1
  step: 1,
  // showForm with true
   showForm: true,
  }

  //This ensures localStorage runs only in the browser, not during build. Vercel
  componentDidMount() {
    const storedHistory =
      JSON.parse(localStorage.getItem('greetingHistory')) || []
    this.setState({history: storedHistory})
  }

  generateGreeting = (name, festival) => {
    const messages = {
      ugadi: [
        'May your year be full of joy!',
        'Wishing you prosperity and happiness!',
        'Celebrate Ugadi with new hopes!',
        'May Ugadi bring success and happiness!',
      ],

      ramadan: [
        'May Allah bless you this Ramadan!',
        'Ramadan Kareem to you and your family!',
        'May peace and blessings be with you!',
        'Wishing you a peaceful Ramadan!',
      ],
    }

    const randomMsg =
      messages[festival][Math.floor(Math.random() * messages[festival].length)]

    const title =
      festival === 'ugadi'
        ? `Happy Ugadi, ${name}!`
        : `Ramadan Mubarak, ${name}!`

    const theme = festival === 'ugadi' ? 'ugadi-card' : 'ramadan-card'

    return {title, message: randomMsg, theme}
  }

  handleNext = () => {
    const {step, name, festival} = this.state

    if (step === 1 && !name.trim()) {
      alert('Please enter your name!')
      return
    }

    if (step === 2 && !festival) {
      alert('Please choose a festival!')
      return
    }

    this.setState({step: step + 1})
  }

  handleBack = () => {
    // when user clicks Back button
// decrease step value by 1
   const {step} = this.state
// use setState to update step
    this.setState({step: step - 1})
  }

  handleSubmit = () => {
    const {name, festival, history} = this.state

    const trimmedName = name.trim() || 'Friend'

    const result = this.generateGreeting(trimmedName, festival)

    this.setState({card: result}, () => {
      html2canvas(this.cardRef, {
        scale: 2,
        useCORS: true,
      }).then(canvas => {
        const image = canvas.toDataURL('image/png')

        const newHistory = [
          {
            title: result.title,
            message: result.message,
            image: image,
          },
          ...history,
        ].slice(0, 3)

        this.setState({history: newHistory})

        localStorage.setItem('greetingHistory', JSON.stringify(newHistory))

        this.setState({showForm: false})
      })
    })
  }
  handleDownload = () => {
    const {card} = this.state

    if (this.cardRef) {
      html2canvas(this.cardRef, {
        scale: 3,
        useCORS: true,
      }).then(canvas => {
        const link = document.createElement('a')
        link.download = `${card.title}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      })
    }
  }

  handleCreateNewCard = () => {
    this.setState({
      // TODO: create handleCreateNewCard function
// when user clicks "Create New Card"
// reset all form values
// name should become empty string
   name:'',
// festival should become empty string
   festival: '',
// card should become null
    card: null,
// step should become 1
   step: 1,
// showForm should become true
    showForm: true,
    })
  }

  handleClearHistory = () => {
    // TODO: create handleClearHistory function
// when user clicks "Clear All"
// remove all greeting history
    localStorage.removeItem('greetingHistory')
// update history state to empty array
    this.setState({
    history: [],
  })
// remove greetingHistory from localStorage
 
    
  }

  render() {
    const {name, festival, card, history, step, showForm} = this.state

    return (
      <div className="body">
        <div className="container">
          <h1>Festival Greeting Generator</h1>

          {showForm && (
            <form>
              {step === 1 && (
                <div className="form-group">
                  <label>Step 1: Your Name</label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => this.setState({name: e.target.value})}
                  />

                  <div className="button-group">
                    <button type="button" onClick={this.handleNext}>
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-group">
                  <label>Step 2: Choose Festival</label>

                  <div className="festival-options">
                    <button
                      type="button"
                      className="festival-btn ugadi-btn"
                      onClick={() =>
                        this.setState({festival: 'ugadi'}, this.handleSubmit)
                      }
                    >
                      🌿 Ugadi
                    </button>

                    <button
                      type="button"
                      className="festival-btn ramadan-btn"
                      onClick={() =>
                        this.setState({festival: 'ramadan'}, this.handleSubmit)
                      }
                    >
                      🌙 Ramadan
                    </button>
                  </div>

                  <div className="button-group">
                    <button type="button" onClick={this.handleBack}>
                      Back
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {card && (
            <>
              <div
                id="greeting-card"
                className={card.theme}
                ref={ref => (this.cardRef = ref)}
              >
                <div className="text-container">
                  <h2 className="name">{card.title}</h2>

                  <p>{card.message}</p>
                </div>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={this.handleDownload}
                  className="download-btn"
                >
                  Download Card
                </button>

                <button
                  type="button"
                  onClick={this.handleCreateNewCard}
                  className="new-card-btn"
                >
                  Create New Card
                </button>
              </div>
            </>
          )}

          {history.length > 0 && (
            <div id="history">
              <div className="history-header">
                <h3>Previous Greetings</h3>

                <button
                  type="button"
                  onClick={this.handleClearHistory}
                  className="clear-btn"
                >
                  Clear All
                </button>
              </div>

              <ul>
                <div className="history-cards">
                  {history.map((item, index) => (
                    <div key={index} className="history-card">
                      <img src={item.image} alt="greeting" />

                      <h4>{item.title}</h4>

                      <p>{item.message}</p>
                    </div>
                  ))}
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default UgadiGreeting
