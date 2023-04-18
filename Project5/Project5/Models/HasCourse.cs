using System.Text.Json.Serialization;

namespace Project5.Models
{
    public class HasCourse
    {
        public int Id { get; set; }

        [JsonIgnore]
        public Plan plan { get; set; }

        public Course course { get; set; }
        public string sem { get; set; }
        public int year { get; set; }

    }
}
