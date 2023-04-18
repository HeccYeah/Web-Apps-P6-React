using System.Text.Json.Serialization;

namespace Project5.Models
{
    public class Catalog
    {
        public int Id { get; set; }
        public int cat_year { get; set; }
        public List<Course> Courses { get; set; }
        [JsonIgnore]
        public List<User> Users { get; set; }
        [JsonIgnore]
        public List<Requirement>? requirements { get; set; }
    }
}
