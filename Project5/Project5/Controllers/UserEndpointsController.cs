using Project5.Data;
using Project5.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Project5.Controllers;

public class UserEndpointsController : Controller
{
    // get all data for user
    [HttpGet]
    [Route("/api/user/getCombined")]
    public IActionResult getCombined()
    {
        // get current databse context variable
        Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();

        // get authenticated user
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // get info for js file
        var combObj = db.User
            .Where(model => model.webId == userId)
            .Include(u => u.plans)
            .ThenInclude(p => p.courses)
            .ThenInclude(h => h.course)
            .Include(u => u.majMins)
            .ThenInclude(m => m.requirements)
            .ThenInclude(r => r.course)
            .Include(u => u.majMins)
            .ThenInclude(m => m.requirements)
            .ThenInclude(r => r.catalog)
            .Include(u => u.catalogs)
            .ThenInclude(c => c.Courses);

        // Return results 
        return Json(combObj);
    }

    // get students for Instructor
    [HttpGet]
    [Route("/api/user/getAdvisees")]
    public IActionResult getInstructorCombined()
    {
        // get current databse context variable
        Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();

        // get authenticated user
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // get info for js file
        var combObj = db.User
            .Where(model => model.webId == userId)
            .Include(p => p.Advises);

        // Return results 
        return Json(combObj);
    }

    // get students for Instructor
    [HttpGet]
    [Route("/api/user/{id}")]
    public IActionResult getCombinedFromID(int id)
    {
        // get current databse context variable
        Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();

        // get info for js file
        var combObj = db.User
            .Where(model => model.Id == id)
            .Include(u => u.plans)
            .ThenInclude(p => p.courses)
            .ThenInclude(h => h.course)
            .Include(u => u.majMins)
            .ThenInclude(m => m.requirements)
            .ThenInclude(r => r.course)
            .Include(u => u.majMins)
            .ThenInclude(m => m.requirements)
            .ThenInclude(r => r.catalog)
            .Include(u => u.catalogs)
            .ThenInclude(c => c.Courses);

        // Return results 
        return Json(combObj);
    }

    // modify hasCourse entry 
    [HttpPut]
    [Route("/api/hascourse/{id}")]
    public IActionResult modHasCourseById(int id, [FromBody] HasCourse updatedHasCourse)
    {
        // get database context
        Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();

        // update hasCourse entry
        var affected = db.HasCourse.Where(model => model.Id == id)
            .ExecuteUpdate(setters => setters
                .SetProperty(m => m.sem, updatedHasCourse.sem)
                .SetProperty(m => m.year, updatedHasCourse.year)
            );

        // Save changes to database
        db.SaveChanges();

        // return errors if necessary
        return affected == 1 ? Ok() : NotFound();
    }

    // make new hasCourse entry
    [HttpPost]
    [Route("/api/hascourse/")]
    public IActionResult createHasCourse([FromBody] HasCourseGen newHasCourseGen)
    {
        // get database context
        Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();

        // get object references


        HasCourse newHasCourse = new HasCourse
        {
            Id = db.HasCourse.Max(h => h.Id) + 1,
            plan = db.Plan.SingleOrDefault(p => p.Id == newHasCourseGen.planId),
            course = db.Course.SingleOrDefault(c => c.Id == newHasCourseGen.courseId),
            sem = newHasCourseGen.sem,
            year = newHasCourseGen.year
        };

        // make hasCourse entry
        var affected = db.HasCourse.Add(newHasCourse);

        // Save changes to database
        db.SaveChanges();

        // return info on created object
        return Ok(new { Id = newHasCourse.Id });
    }

    // delete a hasCourse entry
    [HttpDelete]
    [Route("/api/hascourse/{id}")]
    public IActionResult deleteHasCourse(int id)
    {
        // get database context
        Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();

        // make hasCourse entry
        var affected = db.HasCourse
            .Where(m => m.Id == id)
            .ExecuteDelete();

        // Save changes to database
        db.SaveChanges();

        // return errors if necessary
        return affected == 1 ? Ok() : NotFound();
    }
}