

import "./ButtonRegular.css";


export function ButtonRegular({text}: {text: string}){

    return (
        <>
        <button className="bg-[#bb8d0e] text-white border-none py-2 p-4 text-sm sm:text-[15px] cursor-pointer rounded-sm">{text}</button>
        </>
    )
}