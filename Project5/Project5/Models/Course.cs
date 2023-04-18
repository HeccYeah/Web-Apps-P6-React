using System.Text.Json.Serialization;

namespace Project5.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string c_id { get; set; }
        public string name { get; set; }
        public string? description { get; set; }
        public float credit_hours { get; set; }
        [JsonIgnore]
        public List<Catalog> catalogs { get; set; }
    }
}
