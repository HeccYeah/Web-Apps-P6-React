// Global variables
SEMS = ["Fall", "Spring", "Summer"];

// The whole academic plan for a student to populate the "#plan" div
class Plan 
{
    // create base information
    constructor (name, courses)
    {
        this.name = name; 
        this.courses = courses;
    }
    

    makeYears()
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

async function getData()
{
    // Get data from server
    let response = await fetch('/api/user/getCombined');
    let respJson = await response.json();
    let combObj = respJson[0];

    let catalogObj = combObj.catalogs[0];
    let courseList = catalogObj.courses;

    let programsList = combObj.majMins;
    let majorsList = programsList.filter(p => !p.is_minor && p.id != 4);
    let minorsList = programsList.filter(p => p.is_minor);

    let planList = combObj.plans;

    let reqList = new Array();
    programsList.forEach(p => {
        p.requirements.forEach(r => {
            if (reqList.find(req => {
                return req.req_type == r.req_type && req.c_id == r.course.c_id && req.c_name == r.course.name;
            }) == undefined && r.catalog.cat_year == catalogObj.cat_year) // remove duplicates and stick to right year
            {
                reqList.push({
                    req_type: r.req_type,
                    c_id: r.course.c_id,
                    c_name: r.course.name
                });
            }
        });
    });
    
    // fill out banners with student information
    
    // Add student information to Banner
    let bannerObj = document.getElementById("banner");

    // Create Name in the Banner
    let bannerStudent = document.createElement("span");
    bannerStudent.innerText = "Student: " + combObj.first_name + " " + combObj.last_name;
    bannerStudent.setAttribute('id', 'bannerStudent');
    bannerObj.appendChild(bannerStudent);

    // Create Savior in the Banner
    let bannerSavior = document.createElement("span");
    bannerSavior.innerText = "Savior: " + combObj.savior_name;
    bannerSavior.setAttribute('id', 'bannerSavior');
    bannerObj.appendChild(bannerSavior);

    // Create catYear in the Banner
    let bannerCatYear = document.createElement("span");
    bannerCatYear.innerText = "Catalog year: " + catalogObj.cat_year;
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


    // Plans 

    // Top Banner 
    planElem = document.getElementById("plan");
    gridElem = document.getElementById("gridC");

    // label for selector
    let psLabel = document.createElement("label");
    psLabel.for = "planSelector";
    psLabel.textContent = "Current Plan: ";
    planElem.insertBefore(psLabel, gridElem);

    // plan selector
    let planSelector = document.createElement("select");
    planSelector.id = "planSelector";
    planSelector.onchange = () => {
        planPop();
        polka();
    };
    planElem.insertBefore(planSelector, gridElem);

    let plans = [];

    // plan options
    planList.forEach(planData => {
        // options in selector
        let planOption = document.createElement("option");
        planOption.value = planData.id;
        planOption.textContent = planData.p_name;
        planSelector.appendChild(planOption);
        if (planData.is_default)
        {
            planSelector.value = planData.id;
        }    

        // combine retrieved data into course array
        let courseGen = new Array();
        planData.courses.forEach(crs => {
            courseGen.push(new Course(crs.course.c_id, crs.course.name, crs.year, crs.sem, crs.course.credit_hours, crs.id));
        });
        
        // make plan object
        let myPlan = new Plan(planData.id, courseGen);

        // reorganize plan object
        myPlan.makeYears();

        // store plan for later
        plans[planData.id] = myPlan;
    });

    // spawn plan
    if (planList.length > 0) {
        planPop();
    }
    
    // populate plan with data
    function planPop()
    {
        // clear grid
        while (gridElem.firstChild) {
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
                if (trmSclYr < curSclYr || (trmSclYr == curSclYr && trm.getTermNumber() < SEMS.indexOf(currTerm)))
                {
                    termDiv.classList.add("completed");
                }
                else if (trmSclYr == curSclYr && trm.getTermNumber() == SEMS.indexOf(currTerm))
                {
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
                    crsEntry.classList.add("drag");
                    crsEntry.textContent = crs.id + " " + crs.name;
                    crsList.appendChild(crsEntry);
                });
            });
        });

        // update banner with total credits
        let planTup = planList.find(pt => pt.id == planSelector.value);
        let credNum = 0.0;
        planTup.courses.forEach(crs => {
            credNum += crs.course.credit_hours;
        });
        bannerTotCred.innerText = "Total Credits: " + credNum.toFixed(2); 

        // refresh drag and drop
        refreshDAD();
    }

    function getSemester(){
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let season = "";

        if(month >= 0 && month <= 5){
            season = "Spring";
        }
        else if(month >= 8 && month <= 12){
            season = "Fall";
        }
        else{
            season = "Summer";
        }

        let semester = season + " " + year
        return semester;
    }

    function polka() {
        // clear accordian
        $("#accordion").empty();

        // Add requirements to accordian widget
        $("#accordion").append("<h3 id='coreH'>Core</h3>");
        $("#accordion").append("<div id='Core' style='padding:2px;margin:2px;'></div>");

        $("#accordion").append("<h3 id='elecH'>Elective</h3>");
        $("#accordion").append("<div id='Elective' style='padding:2px;margin:2px;'></div>");

        $("#accordion").append("<h3 id='genH'>GenEd</h3>");
        $("#accordion").append("<div id='GenEd' style='padding:2px;margin:2px;'></div>");

        $("#accordion").append("<h3 id='cogH'>Cognate</h3>");
        $("#accordion").append("<div id='Cognate' style='padding:2px;margin:2px;'></div>");

        reqList.forEach(req => {

            let isSatisfied = (plans[planSelector.value].courses.find(crs => crs.id == req.c_id) != undefined) ? "satisfied" : "unsatisfied";

            let string = req.c_id + " - " + req.c_name;
            // Attempt to add a fun icon to denote whether a requirement is satisfied
            if (isSatisfied == "satisfied") {
                $("#" + req.req_type).append("<span class='ui-icon ui-icon-check green'></span>");
            }
            else {
                $("#" + req.req_type).append("<span class='ui-icon ui-icon-closethick red'></span>");
            }
            $("#" + req.req_type).append("<li class='dragClone " + isSatisfied + "' style='font-size:1em'>" + string + "</li>")
            $("#" + req.req_type).append("<br>");
        });

        $(function () {
            $("#accordion").accordion({
                heightStyle: "fill"
            });
            let cur = $("#accordion").accordion("option", "active");
            $("#accordion").accordion("destroy");
            $("#accordion").accordion({
                heightStyle: "fill",
                active: cur
            });
        });

    }

    polka();

    function formatName(name) {
        // Accordion and gridC names
        if (name.includes(" - ")) {
            let list = name.split(" - ");
            if (list.length > 1) {
                let code = list[0];
                let title = list[1];
                return code + " " + title
            }
            else {
                return name;
            }
        }
        // Class table names
        else {
            return name;
        }
    }

    //Add data to LR table
    $("table").addClass("display compact");
    let count = 1;
    courseList.forEach(crs => {

        $("tbody").append("<tr id=row"+count+" class='dragClone'>");
        $("#row"+count).append("<td>" + crs.c_id + "</td>");
        $("#row"+count).append("<td>" + crs.name + "</td>");
        $("#row"+count).append("<td>" + crs.description + "</td>");
        $("#row"+count).append("<td>" + crs.credit_hours + "</td>");
        count++;
    });

    $(document).ready( function () {
        $('#myTable').DataTable({
            scrollY: '31vh',
            scrollCollapse: true,
            paging: false,
        });
    });

    // Event listener for logout button
    $("#logout").click(function (){
        document.location = "Identity/Account/Logout";
    });

    // refresh drag and drop functionality
    refreshDAD();


    // reactivates drag and drop on all necessary elements
    function refreshDAD() {
        // jQuerey drag and drop implementation
        $(function () {
            $(".dragClone").draggable({
                helper: "clone"
                , cursor: "pointer"
                , zIndex: 1000
                , appendTo: "body"

            });
            $(".drag").draggable({
                cursor: "pointer"
                , zIndex: 1000
                , appendTo: "body"
                , scroll: false
                , stop: function (event, ui) {
                    ui.helper.remove();
                }

            });
            // Make gif the trashcan for dragged courses
            $('#links').droppable({
                accept: "li"
                , drop: function (event, ui) {
                    // update javascript objects
                    let refNum = ui.draggable[0].dataset.hasCourseId;
                    if (refNum != undefined) {
                        plans[planSelector.value].courses = plans[planSelector.value].courses.filter(crs => crs.hasCourseId != refNum);

                        // remove the ui element
                        ui.helper.remove();

                        // update the database
                        let requestOptions = {
                            method: "DELETE",
                        };

                        fetch("/api/hascourse/" + refNum, requestOptions);

                        // restructure js objects
                        plans[planSelector.value].makeYears(); // reconstruct back-end data
                        planPop(); // Probably a more efficient way to do this, but it should work
                        polka();
                    }
                }
            });
            $(".drop").droppable({
                accept: "li, tr"
                , drop: function (event, ui) {
                    let classDropped;
                    if (ui.draggable[0].localName != "tr") {
                        classDropped = formatName(ui.draggable[0].innerText);
                    }
                    else {
                        classDropped = ui.draggable[0].cells[0].innerText + " " + ui.draggable[0].cells[1].innerText;
                    }
                    let ul = $(this).find("ul");
                    ul.append("<li class='drag'>" + classDropped + "</li>");
                    $(".drag").draggable({
                        cursor: "pointer"
                        , zIndex: 1000
                        , appendTo: "body"
                        ,scroll: false
                        , stop: function (event, ui) {
                            ui.helper.remove();
                        }
                    })

                    // Update local data and remote database
                    let termName = $(this).children("p:first");
                    let termInfo = termName[0].innerText.split(" ");
                    let sem = termInfo[0];
                    let year = termInfo[1];

                    let refNum = ui.draggable[0].dataset.hasCourseId;
                    if (refNum != undefined) {
                        // modify local data
                        let currCourse = plans[planSelector.value].courses.find(crs => crs.hasCourseId == refNum);
                        currCourse.semester = sem;
                        currCourse.year = year;
                        plans[planSelector.value].makeYears(); // reconstruct back-end data
                        planPop(); // Probably a more efficient way to do this, but it should work


                        // update remote data
                        let updatedHasCourse = {
                            Id: refNum,
                            plan: {}, // Won't be used
                            course: {}, // Won't be used
                            sem: sem,
                            year: year
                        };
                        let jsonUpdatedHasCourse = JSON.stringify(updatedHasCourse);

                        let requestOptions = {
                            method: "PUT",
                            body: jsonUpdatedHasCourse,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };

                        fetch("/api/hascourse/" + refNum, requestOptions)
                    }
                    else
                    {
                        // add to database
                        let cData = classDropped.split(" ");
                        let currPlanObj = planList.find(p => p.id == planSelector.value);
                        let currCourseObj = courseList.find(c => c.c_id == cData[0]);
                        let newHasCourse = {
                            planId: currPlanObj.id,
                            courseId: currCourseObj.id,
                            sem: sem,
                            year: year,
                        }

                        let jsonNewHasCourse = JSON.stringify(newHasCourse);

                        let requestOptions = {
                            method: "POST",
                            body: jsonNewHasCourse,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }

                        fetch("/api/hascourse/", requestOptions)
                            .then(res => res.json())
                            .then(data => {
                                // Update local values
                                newCourseID = data.id;
                                newCourseCred = data.num_cred
                                plans[planSelector.value].courses.push(new Course(cData[0], currCourseObj.name, year, sem, currCourseObj.credit_hours, newCourseID));
                                plans[planSelector.value].makeYears(); // reconstruct back-end data
                                planPop(); // Probably a more efficient way to do this, but it should work
                                polka();
                            });

                    }
                }
            });
        });
    }
}

getData();