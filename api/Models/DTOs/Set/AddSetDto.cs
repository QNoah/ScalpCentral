using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTOs.Set
{
    public class AddSetDto
    {
        public required string Name { get; set; }
        public required string Series { get; set; }
        public required int TotalCards { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required string ImageLogo { get; set; }
    }
}