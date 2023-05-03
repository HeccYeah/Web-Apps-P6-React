import './login.css';
import './createUser.css';
import './App.css';
import Student from './Components/Student';
import Professor from './Components/Professor';
import Login from './Components/Login';
import CreateUser from './Components/CreateUser';
import { BrowserRouter as Router, Routes, Route, Navigate}
   from 'react-router-dom';


function App() {
 //Set isAuthenticated based on api call
 const isAuthenticated = false;
 return (
   <>
     <Router>
       <Routes>
         <Route exact path='/' element={<AuthWrapper isAuthenticated={isAuthenticated} />}></Route>
         <Route path='/login' element={<Login />}></Route>
         <Route path='/create' element={<CreateUser />}></Route>
         <Route path='/student' element={<Student />}></Route>
         <Route path='/professor' element={<Professor />}></Route>
       </Routes>
     </Router>
   </>
 )
}


const AuthWrapper = ({isAuthenticated}) => {
 return isAuthenticated ? (
   <Navigate to="/student" replace />
 ) : (
   <Navigate to="/login" replace />
 );
};


export default App;