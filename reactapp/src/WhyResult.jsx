import { useParams,Redirect,useHistory } from "react-router-dom";


const WhyResult=()=>{
    const { value } = useParams();
return (
    <>
    <h1 className="text-center col-md-7 alert alert-success mt-5 mx-auto">Your why is {value}</h1>
    </> 
);
}
export default WhyResult;