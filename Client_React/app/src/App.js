import './App.css';
import Banner from './Components/Banner';
import Catalog from './Components/Catalog';
import ClassTable from './Components/ClassTable';
import LowerLeft from './Components/LowerLeft';
import Acordian from './Components/Acordian';
import Notes from './Components/Notes';

function App() {
  return (
    <>
      <Banner></Banner>
      <div id="upper" className = "row">
        <Acordian></Acordian>
        <Notes></Notes>
        <Catalog></Catalog>
      </div>
      <div id="lower" className = "row">
        <LowerLeft></LowerLeft>
        <ClassTable></ClassTable>
      </div>
    </>
  )
}

/*
// get data
let id = '1';

fetch(`http://localhost:3001/users/${id}`)
  .then( res => {
    console.log(res)
    return res.json();
  })
  .then(data => {
    console.log(data)
  })
  .catch(err => console.error(err));
  */

export default App;
