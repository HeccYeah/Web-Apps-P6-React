using System.Text.Json.Serialization;

namespace Project5.Models
{
    public class MajorMinor
    {
        public int Id {  get; set; }
        public string title { get; set; }
        public bool is_minor { get; set; }
        public List<Requirement>? requirements { get; set; }

        [JsonIgnore]
        public List<User>? users { get; set; }
    }
}
