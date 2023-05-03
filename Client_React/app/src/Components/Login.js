function Login () {
    return (
        <>
            <div class="form-style-2-heading">Login</div>
            <form action='http://localhost:3001/login' method='POST'>
                <label for="username"><span>Username <span class="required">*</span></span></label><input type="text" class="input-field" name="username" id="username" />
                <label for="pass"><span>Password <span class="required">*</span></span></label><input type="password" class="input-field" name="pass" id="pass" />
                <label><span> </span><input type="submit" value="Login" /></label>
            </form>
            <form action="http://localhost:3000/create">
                <label><span> </span><input type="submit" value="Create New User" /></label>
            </form>
        </>
    )
}

async function authenticate () {
    alert("init")
    let username = document.getElementById("username").value;
    let pass = document.getElementById("pass").value;

    let details = {
        username: username,
        password: pass
    }

    let requestOptions = {
        method: "POST",
        body: details,
        headers: {
            "Content-Type": "application/json"
        }
    }

    let response = await fetch("http://localhost:3001/login", requestOptions);
    let auth = await response.json();
    console.log(auth);
}

export default Login;