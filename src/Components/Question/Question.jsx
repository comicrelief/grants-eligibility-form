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

      this.state = {
        currentQuestion: 1,
        responses: {},
      }
    }

  static defaultProps = {
    questions: [
      {
        copy: "<p>1: What type of organisation?</p>",
        buttons: [
        { question_type:"organisation-type", text: "Individual", value: "individual", reject:"true", message: "1" },
        { question_type:"organisation-type", text: "Charity", value:"charity", reject:"false", message:"" }]
      },
      {
        copy: "<p>2: Organisation name: 2</p>",
        buttons: [{ question_type:"organisation-name", text: "TEXTFIELD TO COME",  value:"some text", reject: "false", message:"" }]
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

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderButtons() {

    /* Access our zero-indexed question array */
    let currentButtons = this.props.questions[this.state.currentQuestion - 1]['buttons'];

    return (
      <div className="buttons">
        {currentButtons.map(function(thisButton,index){
          return (
            <p key={index}>
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
      let stateCopy = Object.assign({}, this.state);
      stateCopy.currentQuestion = ( thisQuestion + 1 );
      this.setState(stateCopy);
      newPath = `/question/` + ( thisQuestion + 1 );
    } 

    /* If this answer is a direct rejection, forward user to the rejection page with specific variant  */ 
    else if (isRejected === 'true') {
      newPath = `/outcome/` + thisButton.getAttribute("data-m");
    } 

    /* Else, this is our "check" value, and we need to check prior answers to determine the outcome */ 
    else {
      let coreCosts = this.state.responses['core-costs'];
      let over100k = this.state.responses['over-100k'];

      let messageToShow = Question.messageSwitch( thisQuestionType, thisValue, coreCosts, over100k );
      
      console.log("thisQuestionType: ", thisQuestionType, " - thisValue: ", thisValue, " - coreCosts: ", coreCosts, " - over100k: ", over100k);

      console.log("message to show: ", messageToShow);

      // TODO: sort out message switching
      newPath = '';

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
    let currentCopy = this.props.questions[this.state.currentQuestion - 1]['copy'];

    return (
        <div className={'question question-' + this.state.currentQuestion}>
          { Parser(currentCopy) }
          { this.renderButtons() }
        </div>
    );
  }


    /* Helper function to deal with repeated logic */
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
}

/* Define proptypes */
Question.propTypes = {
  questions: propTypes.arrayOf(propTypes.shape({
    copy: propTypes.string.isRequired,
    buttons: propTypes.array.isRequired,
  })).isRequired,};

export default Question;
