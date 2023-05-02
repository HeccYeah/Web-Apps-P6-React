function Login () {
    return (
        <div class="form-style-2">
            <div class="form-style-2-heading">Login</div>
            <form action="https://localhost:3001/login" method="post">
                <label for="username"><span>Username <span class="required">*</span></span><input type="text" class="input-field" name="username" id="username" value="" /></label>
                <label for="pass"><span>Password <span class="required">*</span></span><input type="password" class="input-field" name="pass" id="pass" value="" /></label>
                <label><span> </span><input type="submit" value="Login" /></label>
            </form>
            <form action="https://localhost:3000/create">
                <label><span> </span><input type="submit" value="Create New User" /></label>
            </form>
        </div>
    )
}

export default Login;