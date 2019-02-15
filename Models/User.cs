using System;
using System.Collections.Generic;

namespace doCloud.Models
{
    public class User
    {
        public int usuario_id { get; set; }
        public string usuario { get; set; }
        public string password { get; set; }
        public string nombre  { get; set; }
        public string apellido { get; set; }
        public string telefono { get; set; }
        public string email  { get; set; }
        public int documento  { get; set; }
        public DateTime alta_fecha  { get; set; }
        public DateTime modif_fecha { get; set; }
        public List<Family> famList { get; set; }        
        public List<DocumentType> docTypeList { get; set; }


    }
}