import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";
import Cookies from "js-cookie";

const WhyResult = () => {
  const { value } = useParams();
  const history = useHistory();
  const retakeTest = () => {
    //if the user wants to retake the entire test from beginning, get the userid from cookie and send it to /deleteanswers api 
      let userid=Cookies.get("whyuser");       
    Axios.post("http://localhost:3003/deleteanswers",  { userid: userid })
      .then((response) => {
        if (response.data.deleted) {
          //when the response is receieved i.e all the answers of this user have been deleted, send him to /whyquestionnaire where the first question will
          //load for him
          history.push({ pathname: "/whyquestionnaire" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-center col-md-7 alert alert-success mt-5 mx-auto">
          {Cookies.get("whyusername").toUpperCase()}, Your why is {value}
        </h1>
        <br />
        <button
          id="retaketestbtn"
          className="btn btn-lg btn-primary"
          onClick={retakeTest}
        >
          Retake Test
        </button>
      </div>
    </>
  );
};
export default WhyResult;
