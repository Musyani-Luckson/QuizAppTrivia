import { hp } from "./helper/lib.js";
import { Stack } from "./DS.js";


export class Quiz {
  constructor(items) {
    this.categories = categories(items, "category");
    this.category = {};
    this.item = {};
    this.elements = null;
    this.isCorrect = false;
    this.name = ``;
    this.score = 0;
    this.miss = 0;
    this.size = 0;
    this.currentItem = 0;
    this.timer = 1;
    this.interval = hp.customInterval(() => {
      this.uiLinker()
    }, 1000);
  }
}

Quiz.prototype.start3 = function() {}


Quiz.prototype.handleAnswerSelection = function() {
  const elements = this.elements.answersDiv
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(`click`, () => {
      this.timer = 2
      if (this.item && this.item.answers) {
        let isCorrect = this.item.answers[i].isCorrect;
        switch (isCorrect) {
          case true:
            this.indicator(
              elements[i],
              isCorrect
            )
            this.isCorrect = isCorrect
            break;
          case false:
            this.indicator(
              elements[i],
              isCorrect
            )
            this.isCorrect = isCorrect
            for (let j = 0; j < elements.length; j++) {
              isCorrect = this.item.answers[j].isCorrect;
              switch (isCorrect) {
                case true:
                  this.indicator(
                    elements[j],
                    isCorrect
                  )
                  break;
              }
            }
            break;
        }
      }
    })
  }
}

Quiz.prototype.uiLinker = function() {

  if (this.item && this.item.question && this.item.answers) {

    const text = this.extractQuestionAndAnswers(this.item);
    const readingTime = hp.calculateReadingTime(text, 120, true);
    //
    //
    //
    //
    //
    this.timer = hp.minMax(0, readingTime, this.timer -= 1);
    hp.setInnerText(this.elements.timerEle, this.timer);

    if (this.timer === 0) {
      this.displayItem()
    } else if (this.timer === 1) {
      this.getQuestion();
      switch (this.isCorrect) {
        case true:
          this.score += 1
          break;
        case false:
          this.miss += 1
          break;
      }
      hp.setInnerText(
        this.elements.scoredBoard,
        this.score
      );
      hp.setInnerText(
        this.elements.missedBoard,
        this.miss
      );
    } else if (this.timer > 0) {}

  } else {
    this.stopQuiz()
    this.indicator(this.elements.timerEle, 'start')
    this.elements.timerEle.value = 'start'
    let msg = `Out of ${this.size} questions, ${this.currentItem} where attempted, and ${this.score} were scored and ${this.miss} were missed. So we say your percentage success is ${(this.score*100)/this.size}%`
    alert(msg)
  }
}



Quiz.prototype.displayItem = function() {
  this.currentItem += 1;
  this.isCorrect = false;

  hp.setInnerText(
    this.elements.noOfXBoard,
    `${this.size}/${this.currentItem}`
  )
  hp.setInnerText(
    this.elements.categoryBoard,
    this.item.category
  )
  hp.setInnerText(
    this.elements.questionDiv,
    this.item.question
  )
  this.item.answers = hp.shuffle(this.item.answers)
  displayAnswers(
      [
        this.elements.answersDiv[0],
        this.elements.answersDiv[1],
        this.elements.answersDiv[2],
        this.elements.answersDiv[3],
      ],
    this.item.answers,
    this
  );
}

function displayAnswers(elements, answers, quiz) {

  for (let i in elements) {
    const ele = elements[i].children[1];
    hp.setInnerText(ele, answers[i].ans);
    quiz.indicator(
      elements[i]
    )
  }
}


Quiz.prototype.getHTMLelements = function(elements) {
  this.elements = elements
}
Quiz.prototype.startQuiz = function() {
  this.stopQuiz()
  this.getCategory(
    this.name,
    this.size
  )
  this.getQuestion();
  this.timer = 1;
  this.currentItem = 0;
  this.score = 0;
  this.miss = 0;
  this.isCorrect = false;
  this.interval.start()
  hp.setInnerText(
    this.elements.scoredBoard,
    this.score
  );
  hp.setInnerText(
    this.elements.missedBoard,
    this.miss
  );
}
Quiz.prototype.stopQuiz = function() {
  this.interval.clear()
}
Quiz.prototype.getCategory = function(categoryName, size = 10) {
  let stack = new Stack()
  categoryName = categoryName.toLowerCase().trim();
  this.name = categoryName;
  this.size = size

  this.category = hp.shuffle(this.categories[this.name]);
  stack.push(...this.category.slice(0, this.size))
  this.category = stack
};
Quiz.prototype.getQuestion = function() {
  this.item = this.category.pop()
};
Quiz.prototype.extractQuestionAndAnswers = function(obj) {
  const question = obj.question;
  const answers = obj.answers.map(answer => answer.ans);
  return `${question} ${answers.join(' ')}`;
}

Quiz.prototype.indicator = function(element, value = undefined, truthyColors = {}) {
  let v = {

  }
  switch (value) {
    case true:
    case 'true':
    case 'start':
      hp.cssRules(element, {
        background: `rgba(0, 200, 0, .2)`,
      });
      break;
    case false:
    case 'false':
    case 'stop':
      hp.cssRules(element, {
        background: `rgba(200, 0, 0, .2)`,
      });
      break;
    default:
      hp.cssRules(element, {
        background: `rgba(0, 0, 0, .05)`,
      });
      break
  }
}



//


//


//



//



//



//



//



//



//

function categories(arr, name) {
  arr = questions(arr);
  let names = namesOfCategories(
    arr,
    name
  );
  return grouper(
    arr,
    names,
    name
  );
}

function questions(data) {
  let questions = [];
  data.forEach((question) => {
    questions.push({
      isAttempted: false,
      question: question.question,
      category: question.category.toLowerCase().trim(),
      answers: question.answers,
    });
  });
  return questions;
}

function grouper(arr, names, type) {
  let grouped = {
    all: arr,
  };
  names.forEach((name) => {
    grouped[name] = [];
  });
  arr.forEach((item) => {
    grouped[item[type]].push(item);
  });
  return grouped;
}

function namesOfCategories(arr, name) {
  let names = [];
  arr.forEach((item) => {
    names.push(item[name].toLowerCase().trim());
  });
  return hp.sortArr(names);
}


//





//






//






//






/*
export class Quiz {
  constructor(data) {
    this.maxSize = 0;
    this.scoredCount = 0;
    this.missedCount = 0;
    this.interval = 1;
    this.name = '';
    this.isCorrect = null;
    this.categories = categories(data, "category");
    this.canPickAnswer = true;
    this.toQuiz = new Queue();
    this.timer = 7;
    this.board = {
      currentCategory: '',
      currentmaxOfX: 0,
    };
    this.speed = null

  }
}

Quiz.prototype.popupDialog = function(elements, data) {
  hp.setInnerText(
    elements.bigPer,
    `${data.scored.percentage}%`
  )
  hp.setInnerText(
    elements.scoreNum,
    data.scored.number
  )
  hp.setInnerText(
    elements.scorePer,
    `${data.scored.percentage}%`
  )
  hp.setInnerText(
    elements.missNum,
    data.missed.number
  )
  hp.setInnerText(
    elements.missPer,
    `${data.missed.percentage}%`
  )
  hp.cssRules(
    elements.popupDiv,
    {
      height: '100vh'
    }
  )
}


Quiz.prototype.restoreQuiz = function()
{
  this.maxSize = this.maxSize;
  this.scoredCount = 0;
  this.missedCount = 0;
  this.interval = 1;
  this.isCorrect = null;
  this.canPickAnswer = true;
  this.board = {
    currentCategory: '',
    currentmaxOfX: 0,
  };

}


Quiz.prototype.extractQuestionAndAnswers = function(obj) {
  const question = obj.question;
  const answers = obj.answers.map(answer => answer.ans);
  return `${question} ${answers.join(' ')}`;
}


Quiz.prototype.getCategory = function(categoryName, size = 5) {
  this.toQuiz.clearList()
  categoryName = categoryName.toLowerCase().trim();
  this.name = categoryName
  this.category = hp.shuffle(this.categories[this.name]);
  this.category.slice(0, size).map((item) => {
    this.toQuiz.enqueue(item)
  })
  this.maxSize = this.toQuiz.size
};

Quiz.prototype.getMaxSize = function(size) {
  this.maxSize = size
  this.toQuiz.clearList()
  this.category = hp.shuffle(this.categories[this.name]);
  this.category.slice(0, size).map((item) => {
    this.toQuiz.enqueue(item)
  })
}

Quiz.prototype.getQuestion = function() {
  this.toQuiz.dequeue()

  if (this.toQuiz && this.toQuiz.prevDequeued && this.toQuiz.prevDequeued.answers) {
    this.toQuiz.prevDequeued.answers = hp.shuffle(this.toQuiz.prevDequeued.answers);
    const question = this.toQuiz.prevDequeued

    if (this && this.toQuiz && this.toQuiz.prevDequeued && this.toQuiz.prevDequeued.answers && this.toQuiz.prevDequeued.question) {
      let query = this.toQuiz.prevDequeued
      let string = this.extractQuestionAndAnswers(query)
      let wpm = hp.calculateReadingTime(string, 130, true)
      return {
        question: question,
        time: wpm
      }
    }
    //  return question
  }
};

Quiz.prototype.displayQuestions = function(elements) {
  const data = this.getQuestion()
  if (data !== undefined) {
    const item = data.question
    this.timer = data.time
    if (item && item.question) {
      const question = item.question
      const colors = hp.generateRandomColorScheme()

      this.board.currentmaxOfX = hp.minMax(
        0,
        this.maxSize,
        this.board.currentmaxOfX += 1
      )

      hp.setInnerText(
        elements.question,
        question
      );

      hp.setInnerText(
        elements.category,
        item.category
      );

      hp.setInnerText(
        elements.maxOfX,
        `${this.maxSize}/${this.board.currentmaxOfX}`
      );

      displayAnswers(
    [
      elements.answers[0],
      elements.answers[1],
      elements.answers[2],
      elements.answers[3],
    ],
        hp.shuffle(item.answers)
      );

      this.canPickAnswer = true
    }

  } else {
    // hp.print(this.speed)
  }
};

Quiz.prototype.hriejejd = function() {}

function displayAnswers(elements, answers) {
  answers = hp.shuffle(answers);
  restoreCss(elements)
  for (let i in elements) {
    const ele = elements[i].children[1];
    hp.setInnerText(ele, answers[i].ans);
  }
}

function restoreCss(elements) {
  for (let i = 0; i < elements.length; i++) {
    hp.cssRules(elements[i], {
      background: `transparent`,
    });
  }
}


function questions(data) {
  let questions = [];
  data.forEach((question) => {
    questions.push({
      isAttempted: false,
      question: question.question,
      category: question.category.toLowerCase().trim(),
      answers: question.answers,
    });
  });
  return questions;
}

function grouper(arr, names, type) {
  let grouped = {
    all: arr,
  };
  names.forEach((name) => {
    grouped[name] = [];
  });
  arr.forEach((item) => {
    grouped[item[type]].push(item);
  });
  return grouped;
}

function namesOfCategories(arr, name) {
  let names = [];
  arr.forEach((item) => {
    names.push(item[name].toLowerCase().trim());
  });
  return names;
}

*/