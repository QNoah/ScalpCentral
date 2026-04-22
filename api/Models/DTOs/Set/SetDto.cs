using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTOs.Set
{
    public class SetDTO
    {
        public string Id { get; set; } = string.Empty;
        public required string Name { get; set; }
        public required string Series { get; set; }
        public required int TotalCards { get; set; }
        public required DateOnly ReleaseDate { get; set; }
        public required string ImageLogo { get; set; }
    }
}