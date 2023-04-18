using System.Text.Json.Serialization;

namespace Project5.Models
{
    public class Requirement
    {
        public int Id { get; set; }
        public Catalog catalog { get; set; }
        [JsonIgnore]
        public MajorMinor majorMinor { get; set; }
        public Course course { get; set; } 
        public string req_type { get; set; }

    }
}
