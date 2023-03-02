import { hp } from "./helper/lib.js";
import { Quiz } from "./quiz.js";
import { Stack } from "./Ds.js";




hp.getJSON(`data.json`).then((data) => {
  let defaults = {
    category: `all`,
    nOfQ: 1,
  }
  // html variables 
  let formSelect, categoryBox, maxQustionId, displayTime, questionDiv, answersDiv, noOfXBoard, scoredBoard, missedBoard, categoryBoard
  // variables elements
  noOfXBoard = hp.getDom("id", "maxOfX");
  scoredBoard = hp.getDom("id", "scored");
  missedBoard = hp.getDom("id", "missed");
  categoryBoard = hp.getDom("id", "categoryName");

  formSelect = hp.getDom("class", "formSelect");
  categoryBox = hp.getDom("id", "categoryId");
  maxQustionId = hp.getDom("id", "maxQustionId");
  displayTime = hp.getDom("id", "displayTime");

  questionDiv = hp.getDom("id", "questionDiv");
  answersDiv = hp.getDom("class", "answers");

  let quiz = new Quiz(data)
  quiz.size = defaults.nOfQ
  quiz.getCategory(defaults.category, quiz.size)
  quiz.getHTMLelements(
  {
    questionDiv: questionDiv,
    answersDiv: answersDiv,
    timerEle: displayTime,
    categoryBoard: categoryBoard,
    noOfXBoard: noOfXBoard,
    missedBoard: missedBoard,
    scoredBoard: scoredBoard,
  })
  //
  addOptionsToSelect(
    categoryBox,
    hp.getProps(
      quiz.categories,
      "keys"
    ),
    defaults.category
  );
  addOptionsToSelect(
    maxQustionId,
    hp.pathNums(
      1,
      1,
      quiz.categories[quiz.name].length
    ),
    defaults.nOfQ
  );
  //
  handleQuizInputChange(
    [formSelect[0],
    formSelect[1]],
    quiz
  );
  startStopQuiz(displayTime, quiz)
  quiz.handleAnswerSelection()
})



function startStopQuiz(element, quiz) {
  quiz.indicator(element, element.value)
  element.addEventListener(`click`, () => {
    switch (element.value) {
      case 'start':
        quiz.startQuiz()
        break;
      case 'stop':
        quiz.stopQuiz()
        break
    }
    element.value = hp.switchItems(
      element.value,
      {
        0: 'stop',
        1: 'start'
      }
    )
    quiz.indicator(element, element.value);
  })
}

function handleQuizInputChange(inputs, quiz) {
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.value
      switch (input.name) {
        case "category":
          handleCategoryChange(
            quiz,
            value
          );
          break;
        case "maxQuestion":
          handleMaxQuestionChange(
            quiz,
            value
          );
          break;
      }
      quiz.stopQuiz()
      quiz.indicator(displayTime, 'start')
    });
  });
}

function handleCategoryChange(quiz, value) {
  value = value.toLowerCase().trim()
  const category = quiz.categories[value]
  quiz.getCategory(
    value,
    quiz.size
  )
  addOptionsToSelect(
    maxQustionId,
    hp.pathNums(
      1,
      1,
      quiz.categories[quiz.name].length
    ),
    quiz.size
  );

  maxQustionId.value = quiz.size;
}

function handleMaxQuestionChange(quiz, value) {
  quiz.getCategory(
    quiz.name,
    value
  )
}


function addOptionsToSelect(select, options, selected) {
  select.innerHTML = "";
  options = hp.sortArr(options);
  select.innerHTML = options
    .map(
      (option) => `
    <option value="${option}"${
        option === selected ? " selected" : ""
      }>${option}</option>
  `
    )
    .join("");
}


/* 
let timer, categoryId, maxQustionId, formSelect, questionDiv, answers, timeInt, category, maxOfX, missed, scored, body, popuoDiv, playagain, exit, percenage, scoredPercentageDiv, scoredNumberDiv, missedNumberDiv, missedPercentageDiv

category = hp.getDom(
  "id",
  "categoryName"
);


exit = hp.getDom("id", "exit");
playagain = hp.getDom("id", "playAgain");
percenage = hp.getDom("id", "percenage");
scoredPercentageDiv = hp.getDom("id", "scoredPercentageDiv");
scoredNumberDiv = hp.getDom("id", "scoredNumberDiv");
missedPercentageDiv = hp.getDom("id", "missedPercentageDiv");
missedNumberDiv = hp.getDom("id", "missedNumberDiv");



function scoresData(scores) {
  return {
    scored: {
      number: scores.scored,
      percentage: percenageOf(scores.max, scores.scored),
    },
    missed: {
      number: scores.missed,
      percentage: percenageOf(scores.max, scores.missed),
    }
  }
}

function percenageOf(maxValue, value) {
  return (100 * value) / maxValue
}




maxOfX = hp.getDom("id", "maxOfX");
scored = hp.getDom("id", "scored");
missed = hp.getDom("id", "missed");
body = hp.getDom("id", "body");
popuoDiv = hp.getDom("id", "popuoDiv");

timer = hp.getDom("id", "timer");
categoryId = hp.getDom("id", "categoryId");
maxQustionId = hp.getDom("id", "maxQustionId");
formSelect = hp.getDom("class", "formSelect");
questionDiv = hp.getDom("id", "questionDiv");
answers = hp.getDom("class", "answers");

let displays = {
  question: questionDiv,
  answers: answers,
  category: category,
  maxOfX: maxOfX,
  scored: scored,
  body: body,
  missed: missed,

}

let defaults = {
  nOfQ: 2,
  time: 1000,
}
hp.getJSON(`data.json`).then((data) => {
  let quiz = new Quiz(data);
  // default category 
  quiz.getCategory("all", defaults.nOfQ);
  // list of categories to pick from
  addOptionsToSelect(
    categoryId,
    hp.getProps(
      quiz.categories,
      "keys"
    ),
    "all"
  );
  // number of questions in picked category 
  addOptionsToSelect(
    maxQustionId,
    hp.pathNums(
      1,
      1,
      quiz.category.length
    ),
    defaults.nOfQ
  );
  // eventisteners
  // for inputs
  handleQuizInputChange(
    [formSelect[0],
    formSelect[1]],
    quiz
  );
  // for div answers
  handleAnswerSelection(
    answers,
    quiz
  );
  //quiz.popupDialog(popuoDiv)

  const interval = hp.customInterval(() => { intervalEvents(interval, quiz) }, defaults.time);
  interval.start()
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function intervalEvents(interval, quiz) {
  quiz.interval = hp.minMax(0, quiz.timer, quiz.interval -= 1)

  const time = quiz.interval
  const pick = quiz.canPickAnswer

  if (time === 0) {
    if (!quiz.toQuiz.prevDequeued.isAttempted) {
      quiz.displayQuestions(displays)
      quiz.isCorrect = false
    }
  } else if (time === 1) {
    quiz.canPickAnswer = false;
    scoresBoard(
      quiz,
      scored,
      missed,
      false
    )
  } else if (time > 1) {
    if (!pick) {
      interval.clear()
      quiz.interval = 1
      interval.start()
    }
  }
  if (quiz.toQuiz.size >= 0) {
    // nothing yet...
  } else {
    let dataScores = {
      max: quiz.maxSize,
      scored: quiz.scoredCount,
      missed: quiz.missedCount,
    }
    quiz.popupDialog(
      {
        popupDiv: popuoDiv,
        scoreNum: scoredNumberDiv,
        scorePer: scoredPercentageDiv,
        missNum: missedNumberDiv,
        missPer: missedPercentageDiv,
        bigPer: percenage,
      },
      scoresData(dataScores)
    )
    quiz.interval = 1
    interval.clear()

    playagain.addEventListener('click', () => {
      hp.getJSON(`data.json`).then((data) => {
        let quiz = new Quiz(data);
        // default category 
        quiz.getCategory("all", defaults.nOfQ);
        // list of categories to pick from
        addOptionsToSelect(
          categoryId,
          hp.getProps(
            quiz.categories,
            "keys"
          ),
          "all"
        );
        // number of questions in picked category 
        addOptionsToSelect(
          maxQustionId,
          hp.pathNums(
            1,
            1,
            quiz.category.length
          ),
          defaults.nOfQ
        );
        // eventisteners
        // for inputs
        handleQuizInputChange(
          [formSelect[0],
          formSelect[1]],
          quiz
        );
        // for div answers
        handleAnswerSelection(
          answers,
          quiz
        );
        //quiz.popupDialog(popuoDiv)

        const interval = hp.customInterval(() => { intervalEvents(interval, quiz) }, defaults.time);
        interval.start()
      });

      hp.cssRules(
        popuoDiv,
        {
          height: '0'
        }
      )
      //   quiz.displayQuestions(displays)
      //  interval.start()
    })
  }

  hp.setInnerText(
    timer,
    time
  )
}

function indicator(element, boolean) {
  switch (boolean) {
    case true:
      hp.cssRules(element, {
        background: `rgba(0, 200, 0, .2)`,
      });
      break;
    case false:
      hp.cssRules(element, {
        background: `rgba(200, 0, 0, .2)`,
      });
      break;
  }
}


function handleAnswerSelection(answers, quiz) {
  for (let i = 0; i < answers.length; i++) {

    answers[i].addEventListener(`click`, () => {
      switch (quiz.canPickAnswer) {
        case true:
          let isCorrect = quiz.toQuiz.prevDequeued.answers[i].isCorrect;
          switch (isCorrect) {
            case true:
              indicator(
                answers[i],
                isCorrect
              )
              break;
            case false:
              indicator(
                answers[i],
                isCorrect
              )
              for (let j = 0; j < answers.length; j++) {
                isCorrect = quiz.toQuiz.prevDequeued.answers[j].isCorrect;
                switch (isCorrect) {
                  case true:
                    indicator(
                      answers[j],
                      isCorrect
                    )
                    break;
                }
              }
              break;
          }
          quiz.isCorrect = quiz.toQuiz.prevDequeued.answers[i].isCorrect;
          scoresBoard(
            quiz,
            scored,
            missed,
            true
          )
          quiz.canPickAnswer = false;
          break;
        case false:
          break;
      }
    })
  }
}

function scoresBoard(quiz, scored, missed, isAttempted = false) {
  switch (isAttempted) {
    case true:
      switch (quiz.isCorrect) {
        case true:
          quiz.scoredCount += 1;
          break
        case false:
          quiz.missedCount += 1;
          break
      }
      break
    case false:
      if (!quiz.isCorrect) {
        quiz.missedCount += 1;
      }
      break
  }
  hp.setInnerText(
    missed,
    quiz.missedCount
  );
  hp.setInnerText(
    scored,
    quiz.scoredCount
  );
}

function handleCategoryChange(quiz, value) {
  value = value.toLowerCase().trim()
  const category = quiz.categories[value]
  quiz.getCategory(
    value,
    10
  )
  addOptionsToSelect(
    maxQustionId,
    hp.pathNums(
      1,
      1,
      quiz.category.length
    ),
    quiz.maxSize
  );
}

function handleMaxQuestionChange(quiz, value) {
  quiz.getMaxSize(value)
}

function handleQuizInputChange(inputs, quiz) {
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      quiz.displayQuestions(displays)
      quiz.restoreQuiz()

      const value = input.value
      switch (input.name) {
        case "category":
          handleCategoryChange(
            quiz,
            value
          );
          break;
        case "maxQuestion":
          handleMaxQuestionChange(
            quiz,
            value
          );
          break;
      }
    });
  });
}

function addOptionsToSelect(select, options, selected) {
  select.innerHTML = "";
  options = hp.sortArr(options);
  select.innerHTML = options
    .map(
      (option) => `
    <option value="${option}"${
        option === selected ? " selected" : ""
      }>${option}</option>
  `
    )
    .join("");
}

*/