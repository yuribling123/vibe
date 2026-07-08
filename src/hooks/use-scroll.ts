// tells whether a user scrolled passed the threshold
// the hook listens for page scrolling and keep is scrolled update
import { useEffect, useState } from "react"

export const useScroll = (threshold = 10) =>{
    const [isScrolled,setIsScrolled] = useState(false)

    useEffect(
        ()=>{
            const handleScroll = () => {
                setIsScrolled(window.scrollY > threshold); 
        }

        window.addEventListener("scroll",handleScroll)
        handleScroll();

        return () => window.removeEventListener("scroll",handleScroll) ;

    },[threshold])

    return isScrolled


}