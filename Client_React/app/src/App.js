import './App.css';
import Banner from './Components/Banner';
import Catalog from './Components/Catalog';
import ClassTable from './Components/ClassTable';
import LowerLeft from './Components/LowerLeft';
import Acordian from './Components/Acordian';


function App() {
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

export default App;
