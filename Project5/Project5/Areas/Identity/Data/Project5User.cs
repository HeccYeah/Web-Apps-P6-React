using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Project5.Areas.Identity.Data;

// Add profile data for application users by adding properties to the Project5User class
public class Project5User : IdentityUser
{
    public string ? first_name { set; get; }
    public string ? last_name { set; get; }
    public int ? entry_year { set; get; }
    public int s_id { set; get; }   

}

