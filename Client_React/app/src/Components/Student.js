import Banner from "./Banner"
import Acordian from "./Acordian"
import Notes from "./Notes"
import Catalog from "./Catalog"
import LowerLeft from "./LowerLeft"
import ClassTable from "./ClassTable"

function Student () {
    return (
        <>
            <Banner></Banner>
            <div id="upper" className = "row">
                <Acordian></Acordian>
                <Catalog></Catalog>
            </div>
            <div id="lower" className = "row">
                <LowerLeft></LowerLeft>
                <ClassTable></ClassTable>
            </div>
        </> 
    )
}

export default Student;
