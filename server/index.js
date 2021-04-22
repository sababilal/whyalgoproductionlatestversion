const express = require("express");
const app = express();
const { Op } = require("sequelize");
const cors = require("cors");
const User = require("./model/user");
const Question = require("./model/question");
const Option = require("./model/option");
const Discovery = require("./model/discovery");
const Discoveryanswer = require("./model/discoveryanswer");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

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
            { question_id: qids[0] },
            { question_id: qids[1] },
            { question_id: qids[2] },
            { question_id: qids[3] },
            { question_id: qids[4] },
          ],
        },
      },
    },
    {
      where: {
        discovery_id: discoveryid,
      },
    },
    {
      raw: true,
    }
  );
  return prevDisAns;
};
const findNextQ=(qno,discoveryid,lockedanswer)=>{

  switch (parseInt(qno)) {
    case 1:
     return({ nextQ: 2 });
      break;

    case 2:
      console.log("case 2 running");
      checkDiscoveryAnswer(1, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 1 && lockedanswer == 3) {
            console.log("first if working");
           return({ nextQ: 27 });
          } else if (prevanswer == 2 && lockedanswer == 4) {
            console.log("second if working");

           return({ nextQ: 4 });
          } else {
            console.log("third if working");

           return({ nextQ: 3 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 3:
      if (lockedanswer == 6)return({ nextQ: 27 });
      else if (lockedanswer == 5)return({ nextQ: 4 });
      break;

    case 4:
     return({ nextQ: 5 });
      break;

    case 5:
     return({ nextQ: 6 });
      break;

    case 6:
     return({ nextQ: 7 });
      break;

    case 7:
     return({ nextQ: 8 });
      break;

    case 8:
      var qids = [4, 5, 6, 7, 8];
      var cmCount = 0;
      var mbCount = 0;
      var csCount = 0;
      checkLastFiveDiscoveryAnswers(qids, discoveryid)
        .then((prevanswers) => {
          var prevoption = prevanswers.map(myFunction);
          function myFunction(val) {
            return val.dataValues.option_id;
          }
          for (var i = 0; i < prevoption.length; i++) {
            if (
              prevoption[i] == 7 ||
              prevoption[i] == 10 ||
              prevoption[i] == 13 ||
              prevoption[i] == 16 ||
              prevoption[i] == 19
            ) {
              cmCount++;
            } else if (
              prevoption[i] == 8 ||
              prevoption[i] == 11 ||
              prevoption[i] == 14 ||
              prevoption[i] == 17 ||
              prevoption[i] == 20
            ) {
              mbCount++;
            } else if (
              prevoption[i] == 9 ||
              prevoption[i] == 12 ||
              prevoption[i] == 15 ||
              prevoption[i] == 18 ||
              prevoption[i] == 21
            ) {
              csCount++;
            }
          }

          if (cmCount > mbCount && cmCount > csCount) {
           return({ nextQ: 18 });
          } else if (mbCount > cmCount && mbCount > csCount) {
           return({ nextQ: 21 });
          } else if (csCount > cmCount && csCount > mbCount) {
           return({ nextQ: 24 });
          }

          // Challenge mastery Makes sense Better way   tie
          else if (cmCount == mbCount) {
           return({ nextQ: 9 });
          }

          // Challenge mastery contribute simplify   tie
          else if (cmCount == csCount) {
           return({ nextQ: 15 });
          }

          //  Makes sense Better way contribute simplify  tie
          else if (mbCount == csCount) {
           return({ nextQ: 12 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 9:
     return({ nextQ: 10 });
      break;

    case 10:
      checkDiscoveryAnswer(9, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 40 && lockedanswer == 43) {
           return({ nextQ: 18 });
          } else if (prevanswer == 41 && lockedanswer == 44) {
           return({ nextQ: 21 });
          } else {
           return({ nextQ: 11 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 11:
      if (lockedanswer == 46)return({ nextQ: 18 });
      else if (lockedanswer == 47)return({ nextQ: 21 });
      break;

    case 12:
     return({ nextQ: 13 });
      break;

    case 13:
      checkDiscoveryAnswer(12, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 85 && lockedanswer == 87) {
           return({ nextQ: 21 });
          } else if (prevanswer == 86 && lockedanswer == 88) {
           return({ nextQ: 24 });
          } else {
           return({ nextQ: 14 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 14:
      if (lockedanswer == 89)return({ nextQ: 21 });
      else if (lockedanswer == 90)return({ nextQ: 24 });
      break;

    case 15:
     return({ nextQ: 16 });
      break;

    case 16:
      checkDiscoveryAnswer(15, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 91 && lockedanswer == 93) {
           return({ nextQ: 18 });
          } else if (prevanswer == 92 && lockedanswer == 94) {
           return({ nextQ: 24 });
          } else {
           return({ nextQ: 17 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 17:
      if (lockedanswer == 95)return({ nextQ: 18 });
      else if (lockedanswer == 96)return({ nextQ: 24 });
      break;

    case 18:
     return({ nextQ: 19 });
      break;

    case 19:
      checkDiscoveryAnswer(18, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 55 && lockedanswer == 57) {
           return({ whyresult: "CHALLENGE" });
          } else if (prevanswer == 56 && lockedanswer == 58) {
           return({ whyresult: "MASTERY" });
          } else {
           return({ nextQ: 20 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 20:
      if (lockedanswer == 59)return({ whyresult: "CHALLENGE" });
      else if (lockedanswer == 60)return({ whyresult: "MASTERY" });
      break;

    case 21:
     return({ nextQ: 22 });
      break;

    case 22:
      checkDiscoveryAnswer(21, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 61 && lockedanswer == 63) {
           return({ whyresult: "MAKES SENSE" });
          } else if (prevanswer == 62 && lockedanswer == 64) {
           return({ whyresult: "BETTER WAY" });
          } else {
           return({ nextQ: 23 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 23:
      if (lockedanswer == 65)return({ whyresult: "MAKES SENSE" });
      else if (lockedanswer == 66)
       return({ whyresult: "BETTER WAY" });

      break;

    case 24:
     return({ nextQ: 25 });
      break;

    case 25:
      checkDiscoveryAnswer(24, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 67 && lockedanswer == 69) {
           return({ whyresult: "CONTRIBUTE" });
          } else if (prevanswer == 68 && lockedanswer == 70) {
           return({ whyresult: "SIMPLIFY" });
          } else {
           return({ nextQ: 26 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 26:
      if (lockedanswer == 71)return({ whyresult: "CONTRIBUTE" });
      else if (lockedanswer == 72)return({ whyresult: "SIMPLIFY" });
      break;

    case 27:
     return({ nextQ: 28 });
      break;
      np;
    case 28:
     return({ nextQ: 29 });
      break;

    case 29:
     return({ nextQ: 30 });
      break;

    case 30:
     return({ nextQ: 31 });
      break;

    case 31:
      var qids = [27, 28, 29, 30, 31];
      var trustCount = 0;
      var rightwayCount = 0;
      var clarifyCount = 0;
      var contributeCount = 0;
      checkLastFiveDiscoveryAnswers(qids, discoveryid)
        .then((prevanswers) => {
          prevoption = prevanswers.map(myFunction);
          function myFunction(val) {
            return val.dataValues.option_id;
          }
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
           return({ nextQ: 32 });
          else if (trustCount == 2 && contributeCount == 2)
           return({ nextQ: 33 });
          else if (rightwayCount == 2 && clarifyCount == 2)
           return({ nextQ: 34 });
          else if (rightwayCount == 2 && contributeCount == 2)
           return({ nextQ: 35 });
          else if (trustCount + rightwayCount >= 3)
           return({ nextQ: 36 });
          else if (clarifyCount + contributeCount >= 3)
           return({ nextQ: 39 });
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 32:
      if (lockedanswer == 105)return({ nextQ: 36 });
      else if (lockedanswer == 107)return({ nextQ: 39 });
      break;

    case 33:
      if (lockedanswer == 109)return({ nextQ: 36 });
      else if (lockedanswer == 112)return({ nextQ: 39 });
      break;

    case 34:
      if (lockedanswer == 114)return({ nextQ: 36 });
      else if (lockedanswer == 115)return({ nextQ: 39 });
      break;

    case 35:
      if (lockedanswer == 118)return({ nextQ: 36 });
      else if (lockedanswer == 117)return({ nextQ: 39 });
      break;

    case 36:
     return({ nextQ: 37 });
      break;

    case 37:
      checkDiscoveryAnswer(36, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 119 && lockedanswer == 121) {
           return({ whyresult: "TRUST" });
          } else if (prevanswer == 120 && lockedanswer == 122) {
           return({ whyresult: "RIGHT WAY" });
          } else {
           return({ nextQ: 38 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 38:
      if (lockedanswer == 123)return({ whyresult: "TRUST" });
      else if (lockedanswer == 124)
       return({ whyresult: "RIGHT WAY" });
      break;

    case 39:
     return({ nextQ: 40 });
      break;

    case 40:
      checkDiscoveryAnswer(39, discoveryid)
        .then((prevanswer) => {
          if (prevanswer == 125 && lockedanswer == 127) {
           return({ whyresult: "CLARIFY" });
          } else if (prevanswer == 126 && lockedanswer == 128) {
           return({ whyresult: "CONTRIBUTE" });
          } else {
           return({ nextQ: 41 });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case 41:
      if (lockedanswer == 129)return({ whyresult: "CLARIFY" });
      else if (lockedanswer == 130)
       return({ whyresult: "CONTRIBUTE" });
      break;

    default:
     return("i am in default case");
      }

}


app.post("/question", (req, res) => {
  let qno = req.body.qno;

  findQuestion(qno)
    .then((questionrow) => {
      findOptions(qno)
        .then((options) => {
          res.send([questionrow, options]);
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
  let qno = req.body.qno;
  let lockedanswer = req.body.lockedanswer;
  let userid = 172;
  let courseid = 1;
  findDiscovery(userid, courseid)
    .then((discoveryid) => {
      saveDiscoveryAnswer(discoveryid, lockedanswer)
        .then((response) => {
       const responseObject=  findNextQuestion(qno,discoveryid,lockedanswer);
        console.log(responseObject);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3003, () => {
  console.log("Port 3003 started");
});
