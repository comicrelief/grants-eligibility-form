/* eslint-env browser */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import Questions from './templates/questions.json';

const ReactMarkdown = require('react-markdown');
const shortid = require('shortid');

/**
 * Question class
 */
class Question extends Component {
  /**
   * Question constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.handleButtonChoice = this.handleButtonChoice.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);
    this.updatePath = this.updatePath.bind(this);

    this.state = {
      currentQuestion: 1,
      totalQuestions: 5,
      /* eslint-disable react/no-unused-state */
      responses: {},
      snippets: {},
      successes: {},
      /* eslint-enable react/no-unused-state */
    };
  }

  componentDidMount() {
    this.updateQuestionNumber();
    this.props.resize();
  }

  componentDidUpdate() {
    this.updateQuestionNumber();
    this.props.resize();
    console.log('currState', this.state);
  }

  /* Update the state to reflect our input field */
  handleTextChange(event) {
    const stateCopy = Object.assign({}, this.state);
    stateCopy.responses.company_name = event.target.value;
    this.setState(stateCopy);
  }

  /* Update the state to reflect our current question */
  updateQuestionNumber() {
    const currUrlQ = parseInt(this.props.match.params.question_number, 10);
    if (this.state.currentQuestion !== currUrlQ) {
      this.setState({ currentQuestion: currUrlQ });
    }
  }

  /* Update path to next question or outcome messaging */
  updatePath(inputState) {
    window.scrollTo(0, 0);
    const currentQuestion = parseInt(this.state.currentQuestion, 10);
    const nextQuestion = currentQuestion + 1;

    if (currentQuestion >= this.state.totalQuestions) {
      this.props.history.push({
        pathname: /outcome/,
        state: {
          responses: inputState.responses,
          snippets: inputState.snippets,
          successes: inputState.successes,
        },
      });
    } else {
      this.props.history.push({
        pathname: '/question/' + nextQuestion,
      });
    }
  }

  /* Handles 'submission' of the company input question */
  handleTextSubmit(e) {
    e.preventDefault();

    const stateCopy = Object.assign({}, this.state);
    stateCopy.success = true;

    /* Pass this as a 'success' as there's no fail criteria for this step */
    stateCopy.successes = (this.state.successes).concat('success');
    this.setState(stateCopy);

    this.updatePath();
  }

  /* Allows the user to step back one question by updating the path
     which, in turn, updates the currentQuestion number in updateQuestionNumber func */
  previousQuestion() {
    const newPath = '/question/' + (this.state.currentQuestion - 1);
    this.props.history.push({ pathname: newPath });
  }

  /* Handles submission of each question, storing the response and switching content as required */
  handleButtonChoice(e) {
    /* Get this response's attrs and values */
    const thisButton = e.target;

    const thisValue = thisButton.getAttribute('data-v');
    const thisQuestionType = thisButton.getAttribute('data-q');
    const thisSnippet = thisButton.getAttribute('data-s');
    const thisButtonText = thisButton.textContent || thisButton.innerText;

    /* Store the user's response to the question */
    const stateCopy = Object.assign({}, this.state);
    stateCopy.responses[thisQuestionType] = thisButtonText;
    stateCopy.successes[thisQuestionType] = thisValue;

    /* Not all buttons need an associated snip pet; check before doing anything */
    if (thisSnippet !== null) {
      stateCopy.snippets[thisQuestionType] = thisSnippet;
    } else console.log('No associated snippet to add');

    this.setState(stateCopy);

    /* Update the URL, passing our newly update state copy, so it'll work before a state update */
    this.updatePath(stateCopy);
  }

  progressClassNames(stepNum, currentQ) {
    if (stepNum < currentQ) {
      return 'done';
    } else if (stepNum === currentQ) {
      return 'active';
    } return 'todo';
  }

  renderProgress() {
    const currQ = this.state.currentQuestion;
    const total = this.state.totalQuestions;

    return (
      <ul className={'progress-indicator progress-indicator__steps-' + total + ' step-' + currQ}>
        <li className={'step-1 progress-indicator--' + this.progressClassNames(1, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Start</span>
          </span>
        </li>
        <li className={'step-2 progress-indicator--' + this.progressClassNames(2, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Size</span>
          </span>
        </li>
        <li className={'step-3 progress-indicator--' + this.progressClassNames(3, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Country</span>
          </span>
        </li>
        <li className={'step-4 progress-indicator--' + this.progressClassNames(4, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Topic</span>
          </span>
        </li>
        <li className={'step-5 progress-indicator--' + this.progressClassNames(5, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Criteria</span>
          </span>
        </li>
        <li className={'step-6 progress-indicator--' + this.progressClassNames(6, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Result</span>
          </span>
        </li>
      </ul>
    );
  }

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderTextInput() {
    const currentInput = Questions['q' + this.state.currentQuestion].text_input;

    if (currentInput !== undefined) {
      return (
        <form onSubmit={this.handleTextSubmit}>
          {currentInput.map(thisInput => (
            <div key={thisInput.question_type + 'wrapper'} className="field-item text-input text-align-center">
              <label htmlFor={thisInput.question_type + '__input'} key={thisInput.question_type + '__label'}>{thisInput.text}</label>
              <input
                id={thisInput.question_type + '__input'}
                placeholder={thisInput.text}
                required
                key={thisInput.question_type + '__input'}
                type="text"
                onChange={this.handleTextChange}
                className={thisInput.question_type + '__input'}
                maxLength="200"
              />
              <input
                type="submit"
                value="Continue"
                className={thisInput.question_type + '__submit'}
              />
            </div>
            ))}
        </form>
      );
    }
    return null;
  }

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderButtons() {
    const currentButtons = Questions['q' + this.state.currentQuestion].buttons;

    if (currentButtons !== undefined) {
      return (
        <div className="buttons text-align-center">
          {currentButtons.map((thisButton, index) => (
            <button
              key={thisButton.question_type + '-' + thisButton.text}
              data-q={thisButton.question_type}
              data-v={thisButton.value}
              data-r={thisButton.reject}
              data-m={thisButton.message}
              data-s={thisButton.snippets}
              className={'grants-btn btn btn-' + (index + 1)}
              onClick={this.handleButtonChoice}
            >
              {thisButton.text}
            </button>
            ))}
        </div>
      );
    } return null;
  }

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderPreviousButton() {
    if (this.state.currentQuestion > 1) {
      return (
        <p className="previous-question-btn">
          <button
            key={'back-to-question-' + this.state.currentQuestion}
            className="link--dark-purple link previous-question"
            onClick={this.previousQuestion}
          >
            Back to previous question
          </button>
        </p>
      );
    } else if (this.state.currentQuestion === 1) {
      return (
        <p className="previous-question-btn">
          <a
            key={'back-to-question-' + this.state.currentQuestion}
            className="link--dark-purple link previous-question "
            href="/"
          >
          Back
          </a>
        </p>
      );
    } return null;
  }

  /**
   * Render the Question
   * @return {XML}
   */
  render() {
    const currentQuestionPointer = 'q' + this.state.currentQuestion;

    return (
      <div>
        { Questions[currentQuestionPointer].title !== undefined ?
          <header className="bg--red promo-header promo-header--default promo-header--no-image">
            <div className="promo-header__content">
              <div className="promo-header__content-inner promo-header__content-inner--centre">
                <div className="cr-body">
                  <ReactMarkdown
                    source={Questions[currentQuestionPointer].title}
                    className="text-align-center font--white font--family-bold question-title"
                  />
                </div>
              </div>
            </div>
          </header> :

          <header className="bg--white promo-header promo-header--default promo-header--no-image">
            <div className="promo-header__content">
              <div className="promo-header__content-inner promo-header__content-inner--centre">
                <div className="cr-body">
                  { this.renderProgress() }
                  <p className="text-align-center mobile-progress">
                    Question {this.state.currentQuestion} of {this.state.totalQuestions}
                  </p>
                </div>
              </div>
            </div>
          </header>
      }
        <main role="main" className="bg--grey">
          <section className={'paragraph single-msg single-msg--copy-only bg--white bg--grey question question-' + this.state.currentQuestion}>
            <div className="single-msg__outer-wrapper">
              <div className="single-msg__copy_wrapper bg--white">
                <div className="single-msg__copy">
                  <div className="single-msg__body">
                    <div className="cr-body">

                      {/* Render each element in our copy arrays separately */}
                      {Questions[currentQuestionPointer].copy.map((thisCopy, index) => (
                        <ReactMarkdown
                          key={shortid.generate()}
                          source={thisCopy}
                          className={'text-align-center font--family-bold question-copy question-copy--' + index}
                          renderers={{ link: this.props.markdownLinkRenderer }}
                        />
                      ))}

                      { this.renderTextInput() }
                      { this.renderButtons() }

                      { this.renderPreviousButton() }

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}


/* Define proptypes */
Question.propTypes = {
  resize: propTypes.func,
  markdownLinkRenderer: propTypes.func,
  history: propTypes.shape({
    push: propTypes.func,
  }),
  match: propTypes.shape({
    params: propTypes.shape({
      question_number: propTypes.string,
    }),
  }),
};

Question.defaultProps = {
  resize() { },
  markdownLinkRenderer() { },
  match: null,
  history: { push: null },
};

export default Question;
