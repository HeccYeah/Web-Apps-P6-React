using System.Text.Json.Serialization;

namespace Project5.Models
{
    public class User
    {
        public int Id { get; set; }
        public int s_id { get; set; }
        public string first_name { get; set;}
        public string last_name { get; set;}
        public string savior_name { get; set;}
        public List<Plan>? plans { get; set;}
        public List<MajorMinor>? majMins { get; set;}
        public List<User>? Advises { get; set;}
        [JsonIgnore]
        public List<User>? Advisors { get; set;}
        public List<Catalog>? catalogs { get; set;}
        public string webId { get; set;}

    }
}
