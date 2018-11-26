using System;

namespace doCloud.Models
{
    public class File
    {
        public string name { get; set; }
        public DateTime LastWriteTime { get; set; }
        public long Length { get; set; }
        
    }
}