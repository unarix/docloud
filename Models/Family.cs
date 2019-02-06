using System;
using System.Collections.Generic;

namespace doCloud.Models
{
    public class Family
    {
        public string descripcion { get; set; }
        public double familia_id { get; set; }
        public List<Patent> patentes { get; set; }
        public List<DocumentType> documentos_tipos { get; set; }
        
        
    }
}