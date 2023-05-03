function Login () {
    return (
        <div className="form-style-2">
            <div className="form-style-2-heading">Login</div>
            <form action="http://localhost:3001/login" method="post">
                <label htmlFor="field1"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="field1" id="field1" /></label>
                <label htmlFor="field2"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="field2" id="field2" /></label>
                <label><span> </span><input type="submit" value="Login" /></label>
            </form>
            <form action="http://localhost:3000/create">
            <form action="http://localhost:3000/create">
                <label><span> </span><input type="submit" value="Create New User" /></label>
            </form>
        </div>
    )
 }
 
 
 export default Login;