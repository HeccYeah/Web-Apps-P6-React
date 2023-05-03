import Banner from "./Banner"
import Acordian from "./Acordian"
import ProfCat from "./ProfCat"
import LowerLeft from "./LowerLeft"
import Empty from "./Empty"


function Professor () {
    return (
        <>
            <Banner></Banner>
            <div id="upper" className = "row">
                <Acordian></Acordian>
                <ProfCat></ProfCat>
            </div>
            <div id="lower" className = "row">
                <LowerLeft></LowerLeft>
                <Empty></Empty>
            </div>
        </> 
    )
}

export default Professor;
