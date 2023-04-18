using System.Text.Json.Serialization;

namespace Project5.Models
{
    public class Plan
    {
        public int Id { get; set; }
        public string p_name { get; set;}
        public bool is_default { get; set; }
        
        public virtual List<HasCourse>? courses { get; set; }

    }
}
