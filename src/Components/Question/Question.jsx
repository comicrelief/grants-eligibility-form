import React, { Component } from 'react';
import propTypes from 'prop-types';
import Parser from 'html-react-parser';

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
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      currentQuestion: 1,
      responses: {},
    };
  }

  componentDidMount() {
    this.updateQuestionNumber();
  }

  componentDidUpdate() {
    this.updateQuestionNumber();
  }

  /* Update the state to reflect our input field*/
  handleTextChange(event) {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.responses['company_name'] = event.target.value;
    this.setState(stateCopy);
  }
  
  /* Update the state to reflect our current question */
  updateQuestionNumber() {
    let currUrlQ = parseInt(this.props.match.params.question_number, 10);
    if (this.state.currentQuestion !== currUrlQ ) {
      this.setState({currentQuestion: currUrlQ });
    }
  }

  /* Handles 'submission' of the company input question */
  handleSubmit(event) {
    event.preventDefault();
    /* Create path to next question */
    let nextQuestion = parseInt(this.state.currentQuestion, 10) + 1;
    let newPath = `/question/` + nextQuestion;

    /* Update the URL */
    this.props.history.push({ pathname: newPath });
  }

  

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderButtons() {

    /* Access our zero-indexed question array */
    let currentButtons = this.props.questions[this.state.currentQuestion - 1]['buttons'];

    if (currentButtons !== undefined) {
      return (
        <div className="buttons">
          {currentButtons.map(function(thisButton,index){
            return (
              <p className="btn-wrap" key={index}>
                <a key={index} 
                  data-q={thisButton.question_type}
                  data-v={thisButton.value}
                  data-r={thisButton.reject}
                  data-m={thisButton.message}
                  className='btn btn--red'
                  onClick={function(e){this.submitAnswer(e);}.bind(this)}>
                  {thisButton.text}
                </a>
              </p>
            )
          }.bind(this))}
        </div>
      );
    }
  }

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderInput() {

    /* Access our zero-indexed question array */
    let currentInput = this.props.questions[this.state.currentQuestion - 1]['text_input'];

    if (currentInput !== undefined) {
      return (
        <form onSubmit={this.handleSubmit}>
          {currentInput.map(function(thisInput,index){
            return (
              <div key={index + 'wrapper'} className="field-item text-input">
                <label key={index + 'label'}>{thisInput.text}</label>
                <input required key={index + 'input'} type="text" value={this.state.text_value} onChange={this.handleTextChange}/>
                <input type="submit" value="Submit" />
              </div>
            )
          }.bind(this))}
        </form>
      );
    }
  }

  /* Handles submission of each question, storing the response and switching content as required */
  submitAnswer(e) {

    /* Get this response's attrs and values */
    let thisButton = e.target;
    let isRejected = thisButton.getAttribute("data-r");
    let thisValue = thisButton.getAttribute("data-v");
    let thisQuestionType = thisButton.getAttribute("data-q");

    /* Cache current question to use as array pointer */
    let thisQuestion = this.state.currentQuestion;

    /* Store the user's response to the question */ 
    let stateCopy = Object.assign({}, this.state);
    stateCopy.responses[thisQuestionType] = thisValue;
    this.setState(stateCopy);

    let newPath = "";
    
    /* If this answer still represents an eligable submission, continue the journey */
    if (isRejected === 'false') {
      newPath = `/question/` + ( thisQuestion + 1 );
    } 

    /* If this answer is a direct rejection, forward user to the rejection page with specific variant  */ 
    else if (isRejected === 'true') {
      newPath = `/outcome/` + thisButton.getAttribute("data-m");
    } 

    /* Else, this is our "check" value, and we need to check prior answers to determine the outcome */ 
    else {
      let theseResponses = this.state.responses;
      let messageToShow = Question.messageSwitch( thisQuestionType, thisValue, theseResponses['core-costs'], theseResponses['over-100k'] );
      newPath = `/outcome/` + messageToShow;
    }

    /* Update the URL */
    this.props.history.push({
      pathname: newPath,
    });
  }

  /**
   * Render the Question
   * @return {XML}
   */
  render() {
    // Cache the current copy and user options from our zero-indexed array
    let currentQuestion = this.props.questions[this.state.currentQuestion - 1];
    let currentCopy = currentQuestion['copy'];
    let currentTitle = currentQuestion['title'];

    return (
      <main role="main">
      { currentTitle !== undefined ?
        <header className="bg--red promo-header promo-header--default promo-header--no-image">
          <div className="promo-header__content">
            <div className="promo-header__content-inner promo-header__content-inner--centre">
              <div className="cr-body">
                <h1 className="font--white text-align-center">{ Parser(currentTitle) }</h1>
              </div>
            </div>
          </div>
        </header> :

       <header className="bg--white promo-header promo-header--default promo-header--no-image">
          <div className="promo-header__content">
            <div className="promo-header__content-inner promo-header__content-inner--centre">
              <div className="cr-body">
                <h2 className="font--black text-align-center">(progress bar here)</h2>
              </div>
            </div>
          </div>
        </header>
      }
        <div className={'bg--grey question question-' + this.state.currentQuestion}>
          { Parser(currentCopy) }
          { this.renderInput() }
          { this.renderButtons() }
        </div>
      </main>
    );
  }

  /* Helper function to help contain messy message logic */
  static messageSwitch(currentQuestionType, value, coreCosts, over100k) {
    switch(currentQuestionType) {
      case "sports-project":
        if (coreCosts === 'no'){ return "6"; }
        else if (coreCosts === 'yes') { return (over100k === 'yes' ? "4" : "5"); }
        break;

      case "project-location":
        if (value === 'other') {
          if (coreCosts === 'no'){ return "7"; }
          else if (coreCosts === 'yes') { return (over100k === 'yes' ? "8" : "9"); }
        }
        else if (value === 'india') {
          if (coreCosts === 'no'){ return "10"; }
          else if (coreCosts === 'yes') { return (over100k === 'yes' ? "11" : "12"); }
         } break;

      case "london":
        if (value === 'no') {
          if (coreCosts === 'no'){ return "10"; }
          else if (coreCosts === 'yes') { return (over100k === 'yes' ? "11" : "12"); }
         }
         else if (value === 'yes') {
          if (coreCosts === 'no'){ return "13"; }
          else if (coreCosts === 'yes') { return (over100k === 'yes' ? "14" : "15"); }
         } break;

      default:
        console.log('default');
    }  
  }

  static defaultProps = {
    questions: [
      { 
        title: "Get started",
        copy: "<p>1: What type of organisation?</p>",
        buttons: [
        { question_type:"organisation-type", text: "Individual", value: "individual", reject:"true", message: "1" },
        { question_type:"organisation-type", text: "Charity", value:"charity", reject:"false", message:"" }]
      },
      {
        copy: "<p>2: Organisation name: 2</p>",
        text_input: [{ question_type:"organisation-name", text: "Your organisation name",  value:"some text", reject: "false", message:"" }]
      },
      {
        copy: "<p>3: What activities?</p>",
        buttons: [
        { question_type:"activities-type", text: "Religious", value:"religious", reject: "true", message:"2" },
        { question_type:"activities-type", text: "Other", value:"other", reject: "false", message:"" }]
      },
      { 
        copy: "<p>4: Only looking to cover capital costs?</p>",
        buttons: [
        { question_type:"capital-costs", text: "Yes", value:"yes", reject: "true", message: "3" },
        { question_type:"capital-costs", text: "No", value:"no", reject: "false", message: "" }]
      },
      {
        copy: "<p>5: Core costs?</p>",
        buttons: [
        { question_type:"core-costs", text: "Yes", value:"yes", reject: "false", message: "" },
        { question_type:"core-costs", text: "No", value:"no", reject: "false", message: "" }]
      },
      {
        copy: "<p>6: Over 100k income?</p>",
        buttons: [
        { question_type:"over-100k", text: "Yes", value:"yes", reject: "false", message: "" },
        { question_type:"over-100k", text: "No", value:"no", reject: "false", message: "" }]
      },
      {
        copy: "<p>7: Sports project?</p>",
        buttons: [
        { question_type:"sports-project", text: "Yes", value:"yes", reject: "false", message: "" },
        { question_type:"sports-project", text: "No", value:"no", reject: "check", message: "" }]
      },
      {
        copy: "<p>8: Project location?</p>",
        buttons: [
          { question_type:"project-location", text: "UK", value:"uk", reject: "false", message: "" },
          { question_type:"project-location", text: "India", value:"india", reject: "check", message: "" },
          { question_type:"project-location", text: "Other", value:"other", reject: "check", message: ""  }]
      },
      {
        copy: "<p>9: In London?</p>",
        buttons: [
        { question_type:"london", text: "Yes", value:"yes", reject: "check", message: "" },
        { question_type:"london", text: "No", value:"no", reject: "check", message: "" }]
      },
    ]
  };
}

/* Define proptypes */
Question.propTypes = {
  questions: propTypes.arrayOf(propTypes.shape({
    copy: propTypes.string,
    buttons: propTypes.array,
  })).isRequired,};

export default Question;
