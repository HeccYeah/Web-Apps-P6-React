// Global variables
SEMS = ["Fall", "Spring", "Summer"];
var table;

// The whole academic plan for a student to populate the "#plan" div
class Plan 
{
    // create base information
    constructor (name, courses)
    {
        this.name = name; 
        this.courses = courses;
        this.notes = [];
    }

    makeYears(yearArray)
    {
        // give object years attribute
        this.years = new Array();

        // sort course by term
        this.courses.sort((a, b) => {
            return ((a.year * 3 + ((SEMS.indexOf(a.semester) + 2) % 3) - (b.year * 3 + ((SEMS.indexOf(b.semester) + 2) % 3))));
        });

        let termList = new Array();

        // split courses into terms
        let prevSem = "None";
        let prevYear = -6000;
        let courseList = new Array();
        this.courses.forEach(crs => {
            // combine courses of same term together
            if ((crs.year != prevYear || crs.semester != prevSem) && courseList.length > 0)
            {
                // split off terms
                termList.push(new Term(prevYear, prevSem, courseList));
                courseList = new Array();
            }
            courseList.push(crs);
            prevYear = crs.year;
            prevSem = crs.semester;
        });
        // final check for last term
        if (courseList.length > 0)
        {
            termList.push(new Term(prevYear, prevSem, courseList));
        }
        if (yearArray == undefined)
        {
            // Put terms into years
            let yearTerms = new Array();
            prevYear = -6000;
            termList.forEach(trm => {
                // combine terms of same year together
                let schlYr = getSchoolYear(trm.year, trm.semester);
                if (schlYr != prevYear && yearTerms.length > 0)
                {
                    // split off years
                    this.years.push(new SchoolYear(prevYear, yearTerms));
                    yearTerms = new Array();
                }
                yearTerms.push(trm);
                prevYear = schlYr;
            });
            // Final check for last year
            if (yearTerms.length > 0)
            {
                this.years.push(new SchoolYear(prevYear, yearTerms));
            }
        }
        else
        {
            // Put terms into years
            let yearTerms = new Array();
            prevYear = -6000;
            termList.forEach(trm => {
                // combine terms of same year together
                let schlYr = getSchoolYear(trm.year, trm.semester);
                if (schlYr != prevYear && yearTerms.length > 0)
                {
                    // split off years
                    if (yearArray.find(yr => parseInt(yr) == prevYear) != undefined)
                    {
                        this.years.push(new SchoolYear(prevYear, yearTerms));
                    }
                    yearTerms = new Array();
                }
                yearTerms.push(trm);
                prevYear = schlYr;
            });
            // Final check for last year
            if (yearTerms.length > 0)
            {
                if (yearArray.find(yr => parseInt(yr) == prevYear) != undefined)
                {
                    this.years.push(new SchoolYear(parseInt(prevYear), yearTerms));
                }
            }
            yearArray.forEach(yr => {
                if (this.years.find(sy => sy.startYear == parseInt(yr)) == undefined)
                {
                    this.years.push(new SchoolYear(parseInt(yr), []));
                }
            });
        }
    }
}

// An object to store the information about one course
class Course 
{
    constructor (id, name, year, semester, numCredits, hasCourseId)
    {
        this.id = id; // should match the form "[abbrev]-[num] e.g. CS-1210"
        this.name = name;
        this.year = year; // ideally should be an int
        this.semester = semester; // Spring, Summer, or Fall
        this.numCredits = numCredits; // ideally should be an int
        this.hasCourseId = hasCourseId; // useful for tracking with database
    }
}

// An object to store courses for a semester
class Term
{
    constructor(year, semester, courses)
    {
        this.year = year; // ideally should be an int
        this.semester = semester; // Spring, Summer, or Fall
        this.courses = courses; // an array of Courses
    }

    // returns a string to identify the term in a Plan object
    getTermName() 
    {
        return this.semester + " " + this.year;
    }

    // converts the semester to the collumn number for plan
    getTermNumber()
    {
        return SEMS.indexOf(this.semester);
    }

    getCredits()
    {
        let sum = 0;
        this.courses.forEach(crs => sum += parseFloat(crs.numCredits));
        return sum;
    }
}

// Holds the data for a row in the plan, specifically three terms
class SchoolYear
{
    constructor(startYear, terms)
    {
        this.startYear = startYear;
        this.terms = [3];
        for(let i = 0; i < 3; i++)
        {
            // check for existing term
            let currTerm = terms.find(term => term.getTermNumber() == i);

            // ensure blank terms are created if needed
            if (currTerm == undefined)
            {
                currTerm = new Term(i > 0 ? startYear + 1 : startYear, SEMS[i], new Array());
            }
            this.terms[i] = currTerm;
        }
    }
}

// useful functions

// converts the actual year to the year signifying the row in the plan
function getSchoolYear(year, semester)
{
    return ((semester == "Summer" || semester == "Spring") ? year - 1 : year);
}

async function getData() {
    
    // Get data from server
    // get data
    let id = '1'; //MAKE THIS FROM AUTHENTICATION!!!!!!
    let role = "Professor";

    let response = await fetch(`http://localhost:3001/prof/${id}`)
    let respJson = await response.json();
    let respObj = respJson[0];

    let catalogObj = respObj.courses;
    let courseList = respObj.courseRefs;

    let userMajMins = respObj.majMinRefs;
    let programsList = respObj.majMins;
    let majorsList = programsList.filter(p => p.is_minor == "0" && p.m_id != "3");
    let minorsList = programsList.filter(p => p.is_minor == "1");

    let planList = respObj.plans;
    let yearList = respObj.plan_years;
    let notesList = respObj.plan_notes;

    let advisees = respObj.advisees;

    let planVals = new Map();
    planList.forEach(p => {
        let years = new Array();
        yearList.forEach(yr => {
            if (yr.p_id == p.p_id)
            {
                years.push(yr.year);
            }
        });
        years = years.sort((a, b) => a - b);
        let notes = new Array();
        notesList.forEach(n => {
            if (n.p_id == p.p_id && (role == "Advisor" || n.creatorID == id))
            {
                
                notes.push(n)
            }
        });
        planVals.set(p.p_id, {
            years: years,
            notes: notes,
        });
    });

    // set up student selector

    // Top Banner 
    reqsElem = document.getElementById("reqs");

    // label for student selector
    let ssLabel = document.createElement("label");
    ssLabel.for = "stuSelector";
    ssLabel.textContent = "Current Student: ";
    reqsElem.appendChild(ssLabel);

    // student selector
    let studentSelector = document.createElement("select");
    studentSelector.id = "stuSelector";
    studentSelector.onchange = () => {
        getStuData(studentSelector.value)
    }
    reqsElem.appendChild(studentSelector);
    reqsElem.appendChild(document.createElement("br"));


    // student options 
    advisees.forEach(advisee => {
        let stuOption = document.createElement("option");
        stuOption.value = advisee.id;
        stuOption.textContent = advisee.id + " " + advisee.first_name + " " + advisee.last_name;
        studentSelector.appendChild(stuOption);
    });

    async function getStuData(s_id)
    {
        let response = await fetch(`http://localhost:3001/users/${s_id}`)
        let respJson = await response.json();
        let respObj = respJson[0];

        let catalogObj = respObj.courses;
        let courseList = respObj.courseRefs;

        let programsList = respObj.majMins;
        let majorsList = programsList.filter(p => p.is_minor == "0" && p.m_id != "3");
        let minorsList = programsList.filter(p => p.is_minor == "1");

        let planList = respObj.plans;
        let yearList = respObj.plan_years;
        let notesList = respObj.plan_notes;

        let planVals = new Map();
        planList.forEach(p => {
            let years = new Array();
            yearList.forEach(yr => {
                if (yr.p_id == p.p_id)
                {
                    years.push(yr.year);
                }
            });
            years = years.sort((a, b) => a - b);
            let notes = new Array();
            notesList.forEach(n => {
                if (n.p_id == p.p_id && (role == "Advisor" || n.creatorID == id))
                {
                    
                    notes.push(n)
                }
            });
            planVals.set(p.p_id, {
                years: years,
                notes: notes,
            });
        });

        // fill out banners with student information

        // Add student information to Banner
        let bannerObj = document.getElementById("banner");

        // clear banner minus the academic planning text
        let tempLogo = bannerObj.firstChild;
        bannerObj.removeChild(tempLogo);
        let tempLogoutButton = bannerObj.firstChild;
        bannerObj.removeChild(tempLogoutButton);
        while (bannerObj.firstChild) {
            bannerObj.removeChild(bannerObj.firstChild);
        }    
        bannerObj.appendChild(tempLogo);
        bannerObj.appendChild(tempLogoutButton);

        // Create Name in the Banner
        let bannerStudent = document.createElement("span");
        bannerStudent.innerText = "Student: " + respObj.first_name + " " + respObj.last_name;
        bannerStudent.setAttribute('id', 'bannerStudent');
        bannerObj.appendChild(bannerStudent);

        // Create Savior in the Banner
        let bannerSavior = document.createElement("span");
        bannerSavior.innerText = "Savior: " + respObj.savior;
        bannerSavior.setAttribute('id', 'bannerSavior');
        bannerObj.appendChild(bannerSavior);

        // Create catYear in the Banner
        let bannerCatYear = document.createElement("span");
        bannerCatYear.innerText = "Catalog year: " + respObj.catalog_year;
        bannerCatYear.setAttribute('id', 'bannerCatYear');
        bannerObj.appendChild(bannerCatYear); 

        // Create Majors in the Banner
        let bannerMajor = document.createElement("span");
        let majNum = majorsList.length;
        bannerMajor.innerText = majNum == 1 ? "Major: " : "Majors: ";
        bannerMajor.setAttribute('id', 'bannerMajor');
        bannerObj.appendChild(bannerMajor);

        // Get info for each major
        majorsList.forEach(majInfo => {
            let majSpan = document.createElement("span");
            majSpan.innerText = majInfo.title + (majNum == 1 ? "" : ", ");
            bannerMajor.appendChild(majSpan)
        });

        // Create Minors in the Banner
        let bannerMinor = document.createElement("span");
        let minNum = minorsList.length;
        bannerMinor.innerText = minNum == 1 ? "Minor: " : "Minors: ";
        bannerMinor.setAttribute('id', 'bannerMinor');
        bannerObj.appendChild(bannerMinor);

        // Get info for each minor
        minorsList.forEach(minInfo => {
            let minSpan = document.createElement("span");
            minSpan.innerText = minInfo.title + (minNum == 1 ? "" : ", ");
            bannerMinor.appendChild(minSpan)
        });

        // Create totCred in the Banner
        let bannerTotCred = document.createElement("span");
        bannerTotCred.innerText = "Total Credits: "; // NOTE: should be filled in later by plan
        bannerTotCred.setAttribute('id', 'bannerTotCred');
        bannerObj.appendChild(bannerTotCred);

        // plan selector creation

        let planSelector = document.getElementById("planSelector");
        // clear plan selector
        if (planSelector != undefined) {
            while (planSelector.firstChild) {
                planSelector.removeChild(planSelector.firstChild);
            }
            planSelector.parentNode.removeChild(planSelector);
            reqsElem.removeChild(document.getElementById("planSelectorLabel"));
        }

        // label for plan selector
        let psLabel = document.createElement("label");
        psLabel.for = "planSelector";
        psLabel.textContent = "Current Plan: ";
        psLabel.id = "planSelectorLabel";
        reqsElem.appendChild(psLabel);

        // plan selector
        planSelector = document.createElement("select");
        planSelector.id = "planSelector";
        planSelector.onchange = () => {
            planPop();
        };
        reqsElem.appendChild(planSelector);

        let plans = [];
        
        // plan options update
        planList.forEach(planData => {
            // options in selector
            let planOption = document.createElement("option");
            planOption.value = planData.p_id;
            planOption.textContent = planData.p_name;
            planSelector.appendChild(planOption);
            if (planData.is_default == "1")
            {
                planSelector.value = planData.id;
            }    

            // combine retrieved data into course array
            let courseGen = new Array();
            let planCourses = courseList.filter(crs => crs.p_id == planData.p_id);
            planCourses.forEach(crs => {
                let course = catalogObj.find(c => c.c_id == crs.c_id);
                courseGen.push(new Course(course.c_id, course.course_name, crs.year, crs.sem, parseInt(course.credit_hours), crs._id));
            });
            
            // make plan object
            let myPlan = new Plan(planData.p_id, courseGen);
            myPlan.name = planData.p_name;

            // reorganize plan object
            myPlan.makeYears(planVals.get(planSelector.value).years);

            // store plan for later
            plans[parseInt(planData.p_id)] = myPlan;
        });

        // spawn plan
        if (planList.length > 0) {
            planPop();
        }

        // populate plan with data
        function planPop() {
            let gridElem = document.getElementById("gridC");

            // clear grid
            while (gridElem.firstChild)
            {
                gridElem.removeChild(gridElem.firstChild);
            }

            let currPlan = plans[planSelector.value];
            // rows
            currPlan.years.forEach(yr => {
                yr.terms.forEach(trm => {
                    // term box
                    termDiv = document.createElement("div");
                    termDiv.className = "term";
                    termDiv.classList.add("drop");
                    gridElem.appendChild(termDiv);

                    // add class coloring based on semester

                    // find current semester
                    let currTimeStr = getSemester();
                    let words = currTimeStr.split(" ");
                    let currTerm = words[0];
                    let currYear = words[1];

                    // color relative to current semester
                    let curSclYr = getSchoolYear(currYear, currTerm);
                    let trmSclYr = getSchoolYear(trm.year, trm.semester);
                    if (trmSclYr < curSclYr || (trmSclYr == curSclYr && trm.getTermNumber() < SEMS.indexOf(currTerm))) {
                        termDiv.classList.add("completed");
                    }
                    else if (trmSclYr == curSclYr && trm.getTermNumber() == SEMS.indexOf(currTerm)) {
                        termDiv.classList.add("inProgress");
                    }

                    // term header
                    termTitle = document.createElement("p"); // Changed from h3 to p
                    termTitle.textContent = trm.getTermName();
                    termTitle.className = "termName";
                    termDiv.appendChild(termTitle);

                    // term hours
                    termHours = document.createElement("p") // Changed fro span to p
                    termHours.textContent = "Credits: " + trm.getCredits() + "";
                    termHours.className = "termHours";
                    termDiv.appendChild(termHours)

                    // term courses
                    crsList = document.createElement("ul");
                    termDiv.appendChild(crsList);
                    trm.courses.forEach(crs => {
                        crsEntry = document.createElement("li");
                        crsEntry.dataset.hasCourseId = crs.hasCourseId;
                        crsEntry.textContent = crs.id + " " + crs.name;
                        crsList.appendChild(crsEntry);
                    });
                });
            });

            // update banner with total credits
            let planTup = plans[parseInt(planSelector.value)];
            let credNum = 0.0;
            planTup.courses.forEach(crs => {
                credNum += crs.course.credit_hours;
            });
            bannerTotCred.innerText = "Total Credits: " + credNum.toFixed(2);

            // update course list at the bottom
            catPop();
        }

        function getSemester() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth();
            let season = "";

            if (month >= 0 && month <= 5) {
                season = "Spring";
            }
            else if (month >= 8 && month <= 12) {
                season = "Fall";
            }
            else {
                season = "Summer";
            }

            let semester = season + " " + year
            return semester;
        }

        // populates the catalog based on the user's cat year
        function catPop()
        {
            // Remove all content from current table
            table.clear();
        
            // Add data to LR table
        
            let count = 1;
            $("table").addClass("display compact");
            courseList.forEach(crs => {
                table.row.add([crs.c_id, crs.name, crs.description, crs.credit_hours]);
                count++;
            });
            table.draw();
        }    

        //TODO: FIXME ANDREW
        // Event listener for logout button
        $("#logout").click(function () {
            document.location = "../Identity/Account/Logout";
        });
    }

    getStuData(advisees[0].s_id)

    // populate page
    table.clear();

    // Add data to LR table

    let count = 1;
    $("table").addClass("display compact");
    courseList.forEach(crs => {
        table.row.add([crs.c_id, crs.name, crs.description, crs.credit_hours]);
        count++;
    });
    table.draw();   

    // Event listener for logout button
    $("#logout").click(function () {
        document.location = "../Identity/Account/Logout";
    });

    // handle notes and notes form
    let noteInput = document.getElementById("noteWriter");
    let noteSubmit = document.getElementById("noteSubmitter");
    noteSubmit.addEventListener("click", () => {
        let newNote = {
            note: noteInput.value,
            creatorID: id,
            p_id: planSelector.value,
        }

        let jsonNewNote = JSON.stringify(newNote);

        let requestOptions = {
            method: "POST",
            body: jsonNewNote,
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch("http://localhost:3001/note/", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json(); // this returns a promise
                } else {
                    throw new Error('Error inserting document into database.');
                }
            })
            .then(data => {
                // Update local values
                let newNoteID = data;
                planVals.get(planSelector.value).notes.push({
                    _id: newNoteID,
                    note: noteInput.value,
                    creatorID: id,
                    p_id: planSelector.value,
                });
                notesPop();
            })
            .catch(error => {
                console.error('Error inserting document into database:', error);
            });
    });

    notesPop()

    function notesPop()
    {
        let pNotes = planVals.get(planSelector.value).notes;

        let noteDisplay = document.getElementById("noteList");

        pNotes.forEach(n => {
            let noteEntry = document.createElement("li");
            noteEntry.textContent = n.note;
            noteDisplay.appendChild(noteEntry);

            let delButton = document.createElement("button");
            delButton.textContent = "X";
            delButton.classList.add("delButton");
            delButton.addEventListener("click", () =>
            {
                let refNum = n._id;

                // update the database
                let requestOptions = {
                    method: "DELETE",
                };

                fetch("http://localhost:3001/note/" + refNum, requestOptions);

                planVals.get(planSelector.value).notes = planVals.get(planSelector.value).notes.filter(n => n._id != refNum);
                notesPop();
            });
            noteEntry.appendChild(delButton);
        })
    }
}

// Add functionality to table
$(document).ready(function () {
    table = $('#myTable').DataTable({
        scrollY: '31vh',
        scrollCollapse: true,
        paging: false,
    });
});

// populate page
getData();

