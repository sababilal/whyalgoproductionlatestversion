import React, { useState, useEffect } from "react";
import Axios from "axios";
import AppContext from "./AppContext";
import { useParams, useHistory } from "react-router-dom";
import Option from "./Option";

function App() {
  const [choosenOption, chooseOption] = useState("");
  const AppContextObject = {
    choosenOption: choosenOption,
    chooseOption,
  };
  let history = useHistory();
  const { currentqno } = useParams();

  let optionindex = 0;
  const [qno, setQno] = useState();
  const [qtext, setQtext] = useState();
  const [option, setOptions] = useState([]);

  useEffect(() => {
    Axios.post("http://localhost:3003/question", { qno: currentqno })
      .then((response) => {
        let inside = document.getElementById("insidebox");
        let outside = document.getElementById("outsidebox");

        if (currentqno >= 27) inside.style.display = "block";
        else if (currentqno < 27 && currentqno > 3)
          outside.style.display = "block";
        setQno(response.data[0].id);
        setQtext(response.data[0].question);
        setOptions([...response.data[1]]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentqno]);

  const nextQ = () => {
    document.getElementById("qform").reset();

    if (choosenOption.length == 0) {
      alert("Choose an option");
    } else {
      Axios.post("http://localhost:3003/saveanswer", {
        qno: currentqno,
        lockedanswer: choosenOption,
      })
        .then((response) => {
          setQno("");
          chooseOption("");
          setQtext("");
          setOptions([]);
          if (response.data.nextQ) {
            let nextQ = response.data.nextQ;
            let nextRoute = "/default/" + nextQ;
            history.push({ pathname: nextRoute });
          } else if (response.data.whyresult) {
            let resultPath = "/whyresult/" + response.data.whyresult;
            history.push({ pathname: resultPath });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const optionlist = (val) => {
    return (
      <Option id={val.id} option={val.option} optionindex={++optionindex} />
    );
  };

  return (
    <>
      <AppContext.Provider value={AppContextObject}>
        <div className="row outblock">
          <div className="text-center alert alert-info mx-auto" id="insidebox">
            You are Inside the box
          </div>
          <div className="text-center alert alert-info mx-auto" id="outsidebox">
            You are Outside the box
          </div>

          <br />
          <div className="col-xl-4 col-lg-4 col-md-8 col-sm-10 col-12 mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              id="qform"
            >
              <h3>
                <span>Q{qno} </span>
                {qtext}
              </h3>
              <br />
              {option.map(optionlist)}
              <br />
              <br />
              <button className="btn btn-success" onClick={nextQ}>
                Save and Next
              </button>
            </form>
          </div>
        </div>
      </AppContext.Provider>
    </>
  );
}

export default App;
