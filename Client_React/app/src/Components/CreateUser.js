function CreateUser () {
    return (
        <div class="form-style-2">
            <div class="form-style-2-heading">Provide your information</div>
            <form action="http://localhost:3001/create" method="post">
                <label for="field1"><span>First Name <span class="required">*</span></span><input type="text" class="input-field" name="field1" id="field1" value="" /></label>
                <label for="field2"><span>Last Name <span class="required">*</span></span><input type="text" class="input-field" name="field2" id="field2" value="" /></label>
                <label for="field3"><span>ID Number <span class="required">*</span></span><input type="text" class="input-field" name="field3" id="field3" value="" /></label>
                <label for="field4"><span>Gender <span class="required">*</span></span><select name="field4" id="field4" class="select-field">
                <option value="default">Select One</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select></label>
                <label for="field5"><span>Catalog Year <span class="required">*</span></span><input name="field5" id="field5" class="input-field"></input></label>
                <label for="field6"><span>Username <span class="required">*</span></span><input name="field6" id="field6" class="input-field"></input></label>
                <label for="field7"><span>Password <span class="required">*</span></span><input type="password" name="field7" id="field7" class="input-field"></input></label>
                <label><span> </span><input type="submit" value="Create User" /></label>
            </form>
        </div>
    )
}

export default CreateUser;