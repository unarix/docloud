using System;
using System.Collections.Generic;

namespace doCloud.Models
{
    public class Patent
    {
        public int patente_id { get; set; }
        public string descripcion { get; set; }
        public int DV { get; set; }
        public string image { get; set; }
        public int menu_id { get; set; }
        public string menu_descripcion { get; set; }
        public string opciones_page { get; set; }
        public string pagina { get; set; }
        public string agrupacion{ get; set; }      
        
    }
}