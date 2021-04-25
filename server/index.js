const express = require("express");
const app = express();
const { Op } = require("sequelize");
const cors = require("cors");
const Question = require("./model/question");
const Option = require("./model/option");
const Discovery = require("./model/discovery");
const Discoveryanswer = require("./model/discoveryanswer");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['https://60843d8e4935d28e64d88b7b--romantic-nightingale-2df791.netlify.app/whyquestionnaire','http://localhost:3000'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.get("/getmessage",(req,res)=>{
    fetchQuestion(1, res, 1);
    console.log("fetching.");

})

const findQuestion = async (qno) => {
  const question = await Question.findAll({
    where: {
      id: qno,
    },
    raw: true,
  });
  return question[0];
};

const findOptions = async (qno) => {
  const options = await Option.findAll({
    where: {
      question_id: qno,
    },
    raw: true,
  });
  return options;
};

const findDiscovery = async (userid, courseid) => {
  const discovery = await Discovery.findAll({
    where: {
      user_id: userid,
      course_id: courseid,
    },
    raw: true,
  });
  return discovery[0].id;
};

const saveDiscoveryAnswer = async (discoveryid, lockedanswer) => {
  const DiscoveryAnswer = await Discoveryanswer.create({
    discovery_id: discoveryid,
    option_id: lockedanswer,
  });
  return DiscoveryAnswer;
};

const checkDiscoveryAnswer = async (questionid, discoveryid) => {
  const prevDisAns = await Discoveryanswer.findAll(
    {
      include: {
        model: Option,
        required: true,
        where: {
          question_id: questionid,
        },
      },
    },
    {
      where: {
        discovery_id: discoveryid,
      },
    }
  );
  return prevDisAns[0].option_id;
};
const checkLastFiveDiscoveryAnswers = async (qids, discoveryid) => {
  const prevDisAns = await Discoveryanswer.findAll(
    {
      include: {
        model: Option,
        required: true,
        where: {
          [Op.or]: [
            {
              question_id: qids[0],
            },
            {
              question_id: qids[1],
            },
            {
              question_id: qids[2],
            },
            {
              question_id: qids[3],
            },
            {
              question_id: qids[4],
            },
          ],
        },
      },
    },
    {
      where: {
        discovery_id: discoveryid,
      },
    },
    { raw: true }
  );
  var prevanswers = prevDisAns.map(getOptions);

  function getOptions(val) {
    return val.dataValues.option_id;
  }
  return prevanswers;
};
const findLastDiscoveryAnswer = async (discoveryid) => {
  const lastDiscoveryAnswer = await Discoveryanswer.findAndCountAll({
    include: {
      model: Option,
    },
    where: {
      discovery_id: discoveryid,
    },
    order: [["id", "DESC"]],
  });

  if (lastDiscoveryAnswer.count > 0)
    return {
      lastQuestion:
        lastDiscoveryAnswer.rows[0].dataValues.option.dataValues.question_id,
      lastOption: lastDiscoveryAnswer.rows[0].dataValues.option_id,
      questionsAnswered: lastDiscoveryAnswer.count,
    };
  else return null;
};

const findLastDiscoveryAnswerId = async (discoveryid) => {
  const lastDiscoveryAnswer = await Discoveryanswer.findAll({
    where: {
      discovery_id: discoveryid,
    },
    order: [["id", "DESC"]],
    limit: 1,
    raw: true,
  });
  return lastDiscoveryAnswer[0].id;
};

const deletediscoveryAnswers = async (discoveryid) => {
  const deletedEntriesCount = await Discoveryanswer.destroy({
    where: {
      discovery_id: discoveryid,
    },
  });
  return deletedEntriesCount;
};

const deletelastAnswer = async (discoveryanswerid) => {
  const deletedEntriesCount = await Discoveryanswer.destroy({
    where: {
      id: discoveryanswerid,
    },
  });
  return deletedEntriesCount;
};

const fetchQuestion = (qno, res, questionindex) => {
  findQuestion(qno)
    .then((questionrow) => {
      findOptions(qno)
        .then((options) => {
          res.send([questionrow, options, questionindex]);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

const decideNextQuestion = (
  lastQuestion,
  lastOption,
  questionIndex,
  discoveryid,
  res
) => {
  switch (parseInt(lastQuestion)) {
    case 1:
      fetchQuestion(2, res, questionIndex);
      break;

    case 2:
      checkDiscoveryAnswer(1, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 1 && lastOption == 3) {
            fetchQuestion(27, res, questionIndex);
          } else if (prevanswer == 2 && lastOption == 4) {
            fetchQuestion(4, res, questionIndex);
          } else {
            fetchQuestion(3, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 3:
      if (lastOption == 6) fetchQuestion(27, res, questionIndex);
      else if (lastOption == 5) fetchQuestion(4, res, questionIndex);
      break;

    case 4:
      fetchQuestion(5, res, questionIndex);
      break;

    case 5:
      fetchQuestion(6, res, questionIndex);
      break;

    case 6:
      fetchQuestion(7, res, questionIndex);
      break;

    case 7:
      fetchQuestion(8, res, questionIndex);
      break;

    case 8:
      var lastFiveQuestionIds = [4, 5, 6, 7, 8];
      var challengeMasteryCount = 0;
      var makessenseBetterywayCount = 0;
      var contributeSimplifyCount = 0;
      checkLastFiveDiscoveryAnswers(lastFiveQuestionIds, discoveryid)
        .then((prevoption) => {
          for (var i = 0; i < prevoption.length; i++) {
            if (
              prevoption[i] == 7 ||
              prevoption[i] == 10 ||
              prevoption[i] == 13 ||
              prevoption[i] == 16 ||
              prevoption[i] == 19
            ) {
              challengeMasteryCount++;
            } else if (
              prevoption[i] == 8 ||
              prevoption[i] == 11 ||
              prevoption[i] == 14 ||
              prevoption[i] == 17 ||
              prevoption[i] == 20
            ) {
              makessenseBetterywayCount++;
            } else if (
              prevoption[i] == 9 ||
              prevoption[i] == 12 ||
              prevoption[i] == 15 ||
              prevoption[i] == 18 ||
              prevoption[i] == 21
            ) {
              contributeSimplifyCount++;
            }
          }

          if (
            challengeMasteryCount > makessenseBetterywayCount &&
            challengeMasteryCount > contributeSimplifyCount
          ) {
            fetchQuestion(18, res, questionIndex);
          } else if (
            makessenseBetterywayCount > challengeMasteryCount &&
            makessenseBetterywayCount > contributeSimplifyCount
          ) {
            fetchQuestion(21, res, questionIndex);
          } else if (
            contributeSimplifyCount > challengeMasteryCount &&
            contributeSimplifyCount > makessenseBetterywayCount
          ) {
            fetchQuestion(24, res, questionIndex);
          }

          // Challenge mastery Makes sense Better way   tie
          else if (challengeMasteryCount == makessenseBetterywayCount) {
            fetchQuestion(9, res, questionIndex);
          }

          // Challenge mastery contribute simplify   tie
          else if (challengeMasteryCount == contributeSimplifyCount) {
            fetchQuestion(15, res, questionIndex);
          }

          // Makes sense Better way contribute simplify  tie
          else if (makessenseBetterywayCount == contributeSimplifyCount) {
            fetchQuestion(12, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 9:
      fetchQuestion(10, res, questionIndex);
      break;

    case 10:
      checkDiscoveryAnswer(9, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 40 && lastOption == 43) {
            fetchQuestion(18, res, questionIndex);
          } else if (prevanswer == 41 && lastOption == 44) {
            fetchQuestion(21, res, questionIndex);
          } else {
            fetchQuestion(11, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 11:
      if (lastOption == 46) fetchQuestion(18, res, questionIndex);
      else if (lastOption == 47) fetchQuestion(21, res, questionIndex);
      break;

    case 12:
      fetchQuestion(13, res, questionIndex);
      break;

    case 13:
      checkDiscoveryAnswer(12, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 85 && lastOption == 87) {
            fetchQuestion(21, res, questionIndex);
          } else if (prevanswer == 86 && lastOption == 88) {
            fetchQuestion(24, res, questionIndex);
          } else {
            fetchQuestion(14, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 14:
      if (lastOption == 89) fetchQuestion(21, res, questionIndex);
      else if (lastOption == 90) fetchQuestion(24, res, questionIndex);
      break;

    case 15:
      fetchQuestion(16, res, questionIndex);
      break;

    case 16:
      checkDiscoveryAnswer(15, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 91 && lastOption == 93) {
            fetchQuestion(18, res, questionIndex);
          } else if (prevanswer == 92 && lastOption == 94) {
            fetchQuestion(24, res, questionIndex);
          } else {
            fetchQuestion(17, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 17:
      if (lastOption == 95) fetchQuestion(18, res, questionIndex);
      else if (lastOption == 96) fetchQuestion(24, res, questionIndex);
      break;

    case 18:
      fetchQuestion(19, res, questionIndex);
      break;

    case 19:
      checkDiscoveryAnswer(18, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 55 && lastOption == 57) {
            res.send({ whyresult: "CHALLENGE" });
          } else if (prevanswer == 56 && lastOption == 58) {
            res.send({ whyresult: "MASTERY" });
          } else {
            fetchQuestion(20, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 20:
      if (lastOption == 59) res.send({ whyresult: "CHALLENGE" });
      else if (lastOption == 60) res.send({ whyresult: "MASTERY" });
      break;

    case 21:
      fetchQuestion(22, res, questionIndex);
      break;

    case 22:
      checkDiscoveryAnswer(21, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 61 && lastOption == 63) {
            res.send({ whyresult: "MAKES SENSE" });
          } else if (prevanswer == 62 && lastOption == 64) {
            res.send({ whyresult: "BETTER WAY" });
          } else {
            fetchQuestion(23, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 23:
      if (lastOption == 65) res.send({ whyresult: "MAKES SENSE" });
      else if (lastOption == 66) res.send({ whyresult: "BETTER WAY" });
      break;

    case 24:
      fetchQuestion(25, res, questionIndex);
      break;

    case 25:
      checkDiscoveryAnswer(24, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 67 && lastOption == 69) {
            res.send({ whyresult: "CONTRIBUTE" });
          } else if (prevanswer == 68 && lastOption == 70) {
            res.send({ whyresult: "SIMPLIFY" });
          } else {
            fetchQuestion(26, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 26:
      if (lastOption == 71) res.send({ whyresult: "CONTRIBUTE" });
      else if (lastOption == 72) res.send({ whyresult: "SIMPLIFY" });
      break;

    case 27:
      fetchQuestion(28, res, questionIndex);
      break;

    case 28:
      fetchQuestion(29, res, questionIndex);
      break;

    case 29:
      fetchQuestion(30, res, questionIndex);
      break;

    case 30:
      fetchQuestion(31, res, questionIndex);
      break;

    case 31:
      var lastFiveQuestionIds = [27, 28, 29, 30, 31];
      var trustCount = 0;
      var rightwayCount = 0;
      var clarifyCount = 0;
      var contributeCount = 0;

      checkLastFiveDiscoveryAnswers(lastFiveQuestionIds, discoveryid)
        .then((prevoption) => {
          for (i = 0; i < prevoption.length; i++) {
            if (
              prevoption[i] == 73 ||
              prevoption[i] == 75 ||
              prevoption[i] == 77 ||
              prevoption[i] == 97 ||
              prevoption[i] == 101
            ) {
              trustCount++;
            } else if (
              prevoption[i] == 74 ||
              prevoption[i] == 76 ||
              prevoption[i] == 78 ||
              prevoption[i] == 98 ||
              prevoption[i] == 102
            ) {
              rightwayCount++;
            } else if (
              prevoption[i] == 79 ||
              prevoption[i] == 81 ||
              prevoption[i] == 83 ||
              prevoption[i] == 99 ||
              prevoption[i] == 103
            ) {
              clarifyCount++;
            } else if (
              prevoption[i] == 80 ||
              prevoption[i] == 82 ||
              prevoption[i] == 84 ||
              prevoption[i] == 100 ||
              prevoption[i] == 104
            ) {
              contributeCount++;
            }
          }
          if (trustCount == 2 && clarifyCount == 2)
            fetchQuestion(32, res, questionIndex);
          else if (trustCount == 2 && contributeCount == 2)
            fetchQuestion(33, res, questionIndex);
          else if (rightwayCount == 2 && clarifyCount == 2)
            fetchQuestion(34, res, questionIndex);
          else if (rightwayCount == 2 && contributeCount == 2)
            fetchQuestion(35, res, questionIndex);
          else if (trustCount + rightwayCount >= 3)
            fetchQuestion(36, res, questionIndex);
          else if (clarifyCount + contributeCount >= 3)
            fetchQuestion(39, res, questionIndex);
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 32:
      if (lastOption == 105) fetchQuestion(36, res, questionIndex);
      else if (lastOption == 107) fetchQuestion(39, res, questionIndex);
      break;

    case 33:
      if (lastOption == 109) fetchQuestion(36, res, questionIndex);
      else if (lastOption == 112) fetchQuestion(39, res, questionIndex);
      break;

    case 34:
      if (lastOption == 114) fetchQuestion(36, res, questionIndex);
      else if (lastOption == 115) fetchQuestion(39, res, questionIndex);
      break;

    case 35:
      if (lastOption == 118) fetchQuestion(36, res, questionIndex);
      else if (lastOption == 117) fetchQuestion(39, res, questionIndex);
      break;

    case 36:
      fetchQuestion(37, res, questionIndex);
      break;

    case 37:
      checkDiscoveryAnswer(36, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 119 && lastOption == 121) {
            res.send({ whyresult: "TRUST" });
          } else if (prevanswer == 120 && lastOption == 122) {
            res.send({ whyresult: "RIGHT WAY" });
          } else {
            fetchQuestion(38, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 38:
      if (lastOption == 123) res.send({ whyresult: "TRUST" });
      else if (lastOption == 124) res.send({ whyresult: "RIGHT WAY" });
      break;

    case 39:
      fetchQuestion(40, res, questionIndex);
      break;

    case 40:
      checkDiscoveryAnswer(39, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 125 && lastOption == 127) {
            res.send({ whyresult: "CLARIFY" });
          } else if (prevanswer == 126 && lastOption == 128) {
            res.send({ whyresult: "CONTRIBUTE" });
          } else {
            fetchQuestion(41, res, questionIndex);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 41:
      if (lastOption == 129) res.send({ whyresult: "CLARIFY" });
      else if (lastOption == 130) res.send({ whyresult: "CONTRIBUTE" });
      break;

    default:
      res.send("i am in default case");
  }
};

app.post("/whyquestion", (req, res) => {
  let userid = 172;
  let courseid = 1;
  findDiscovery(userid, courseid)
    .then((discoveryid) => {
      findLastDiscoveryAnswer(discoveryid)
        .then((lastDiscoveryAnswer) => {
          if (lastDiscoveryAnswer == null) {
            fetchQuestion(1, res, 1);
          } else {
            let lastQuestion = lastDiscoveryAnswer.lastQuestion;
            let lastOption = lastDiscoveryAnswer.lastOption;
            let questionIndex = lastDiscoveryAnswer.questionsAnswered + 1;
            decideNextQuestion(
              lastQuestion,
              lastOption,
              questionIndex,
              discoveryid,
              res
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/saveanswer", (req, res) => {
  let lockedanswer = req.body.lockedanswer;
  let userid = 172;
  let courseid = 1;
  findDiscovery(userid, courseid)
    .then((discoveryid) => {
      saveDiscoveryAnswer(discoveryid, lockedanswer)
        .then((response) => {
          res.send({ saved: true });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/deleteanswers", (req, res) => {
  let userid = 172;
  let courseid = 1;
  findDiscovery(userid, courseid)
    .then((discoveryid) => {
      deletediscoveryAnswers(discoveryid).then((deletedEntriesCount) => {
        res.send({ deleted: true });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/deletelastanswer", (req, res) => {
  let userid = 172;
  let courseid = 1;
  findDiscovery(userid, courseid).then((discoveryid) => {
    findLastDiscoveryAnswerId(discoveryid)
      .then((lastDiscoveryAnswerId) => {
        deletelastAnswer(lastDiscoveryAnswerId).then((deletedEntriesCount) => {
          res.send({ deleted: true });
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
app.listen(process.env.PORT||PORT, () => {
  console.log("Port at heroku started");
});
