function CreateUser () {
    return (
        <div className="form-style-2">
            <div className="form-style-2-heading">Provide your information</div>
            <form action="http://localhost:3001/create" method="post">
                <label htmlFor="field1"><span>First Name <span className="required">*</span></span><input type="text" className="input-field" name="field1" id="field1"  /></label>
                <label htmlFor="field2"><span>Last Name <span className="required">*</span></span><input type="text" className="input-field" name="field2" id="field2"  /></label>
                <label htmlFor="field3"><span>ID Number <span className="required">*</span></span><input type="text" className="input-field" name="field3" id="field3" /></label>
                <label htmlFor="field4"><span>Gender <span className="required">*</span></span><select name="field4" id="field4" className="select-field">
                <option value="default">Select One</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select></label>
                <label htmlFor="field5"><span>Catalog Year <span className="required">*</span></span><input name="field5" id="field5" className="input-field"></input></label>
                <label htmlFor="field6"><span>Username <span className="required">*</span></span><input name="field6" id="field6" className="input-field"></input></label>
                <label htmlFor="field7"><span>Password <span className="required">*</span></span><input type="password" name="field7" id="field7" className="input-field"></input></label>
                <label><span> </span><input type="submit" value="Create User" /></label>
            </form>
        </div>
    )
 }
 
 
 export default CreateUser;
 