import { useState ,useContext} from "react";
import AppContext from './AppContext';

const Option=(props)=>{
const myContext =useContext(AppContext);
 return (
     <>
     <span>{props.optionindex}&nbsp;&nbsp;</span>
      <input type="radio" required value={props.id} name="option" onChange={(e) => { myContext.chooseOption(props.id) }} />
        <label>&nbsp;{props.option}</label>
        <br/>
     </>
 );

}
export default Option;