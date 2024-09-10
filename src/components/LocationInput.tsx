
import { forwardRef, useState, useMemo } from "react";
import citiesList from "@/lib/cities-list";
import {Input} from "./ui/input"
interface LocationInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
 onLocationSelected:(location:string)=>void;
}
export default forwardRef<HTMLInputElement, LocationInputProps>(function LocationInput({onLocationSelected,...props},ref){

const [locationSearchInput, setLocationSearchInput] = useState("");
const [hasFocus, setHasFocus] = useState(false);
const cities = useMemo(()=>{
    if(!locationSearchInput.trim()) return [];
   const searchWords = locationSearchInput.split(" ");
   return citiesList.map(city=>`${city.name},${city.country}`
   )
   .filter(city=>
    city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
    searchWords.every(word=>city.toLowerCase().includes(word.toLowerCase())) 
   )
   .slice(0,5);

},[locationSearchInput])

return (
       <div className="relative">
        <Input 
        placeholder="Search for a city"
        type="search"
        value={locationSearchInput}
        onChange={(e)=>setLocationSearchInput(e.target.value)}
        onFocus ={()=>setHasFocus(true)}
        onBlur={()=>setHasFocus(false)}
        {...props} ref={ref} />
        {locationSearchInput.trim() && hasFocus &&(
            <div className="absolute w-full bg-background divide-y z-20 shadow-xl border-x border-b roubded-b-lg">

             {!cities.length  &&  <p className="p-3">no results found</p>}
             {cities.map(city=>(
                <button key={city} className="block w-full text-start p-2 " 
                onMouseDown={(e)=>{
                    e.preventDefault();
                    onLocationSelected(city);
                    setLocationSearchInput("");
                }}
                 >
                    {city}
                </button>
             ))}
            </div>
)}
</div>
)
}

)
