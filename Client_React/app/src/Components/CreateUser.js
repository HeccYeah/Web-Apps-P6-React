function CreateUser () {
    return (
        <div class="form-style-2">
            <div class="form-style-2-heading">Provide your information</div>
            <form action="createUser.php" method="post">
                <label for="fname"><span>First Name <span class="required">*</span></span><input type="text" class="input-field" name="fname" id="fname" value="" /></label>
                <label for="lname"><span>Last Name <span class="required">*</span></span><input type="text" class="input-field" name="lname" id="lname" value="" /></label>
                <label for="id"><span>ID Number <span class="required">*</span></span><input type="text" class="input-field" name="id" id="id" value="" /></label>
                <label for="gender"><span>Gender <span class="required">*</span></span><select name="gender" id="gender" class="select-field">
                <option value="default">Select One</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select></label>
                <label for="catYear"><span>Catalog Year <span class="required">*</span></span><input name="catYear" id="catYear" class="input-field"></input></label>
                <label for="username"><span>Username <span class="required">*</span></span><input name="username" id="username" class="input-field"></input></label>
                <label for="pass"><span>Password <span class="required">*</span></span><input type="password" name="pass" id="pass" class="input-field"></input></label>
                <label><span> </span><input type="submit" value="Create User" /></label>
            </form>
        </div>
    )
}

export default CreateUser;