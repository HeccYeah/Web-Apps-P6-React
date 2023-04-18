using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project5.Models;
using System.Diagnostics;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Dynamic;
using Newtonsoft.Json;
using Project5.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Project5.Data;

namespace Project5.Controllers
{
    public class HomeController : Controller
    {
        // redirection logic
        private readonly ILogger<HomeController> _logger;
        UserManager<Project5User> _userManager;

        public HomeController(ILogger<HomeController> logger, UserManager<Project5User> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        [Authorize]
        public IActionResult Index()
        {
            // get current databse context variable
            Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();
            //Get current user
            Project5User _user = _userManager.GetUserAsync(HttpContext.User).Result;
            //Query database to find role of current user
            var roleObj = db.UserRoles.Where(r => r.UserId == _user.Id);
            string roleId = roleObj.ToList()[0].RoleId;

            //Direct users to different pages pased on role
            if(roleId == "professor")
            {
                return new RedirectResult("/Home/Professor");
            }
            else if(roleId == "admin")
            {
                return new RedirectResult("/Users");
            }
            else
            {
                return View();
            }

        }

   
        public IActionResult Professor() 
        {
            // get current databse context variable
            Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();
            //Get current user
            Project5User _user = _userManager.GetUserAsync(HttpContext.User).Result;
            //Query database to find role of current user
            var roleObj = db.UserRoles.Where(r => r.UserId == _user.Id);
            string roleId = roleObj.ToList()[0].RoleId;

            //Direct users to different pages pased on role
            if (roleId == "professor")
            {
                return View();
            }
            else if (roleId == "admin")
            {
                return new RedirectResult("/Users");
            }
            else
            {
                return new RedirectResult("/Home");
            }
        }

        //[Authorize(Roles ="admin")]
        public IActionResult Admin()
        {
            // get current databse context variable
            Project5Context db = HttpContext.RequestServices.GetService<Project5Context>();
            //Get current user
            Project5User _user = _userManager.GetUserAsync(HttpContext.User).Result;
            //Query database to find role of current user
            var roleObj = db.UserRoles.Where(r => r.UserId == _user.Id);
            string roleId = roleObj.ToList()[0].RoleId;

            //Direct users to different pages pased on role
            if (roleId == "professor")
            {
                return new RedirectResult("/Home/Professor");
            }
            else if (roleId == "admin")
            {
                return new RedirectResult("/Users");
            }
            else
            {
                return new RedirectResult("/Home");
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

    
}