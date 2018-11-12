using System;

namespace doCloud.Models
{
    public class DocumentType
    {
        public double idns_documento_tipo { get; set; }
        public string sd_descripcion { get; set; }
        public DateTime h_alta { get; set; }
        public int n_responsable { get; set; }
        public int n_aeropuertos { get; set; }
        public int n_clientes { get; set; }
        public int n_destinatarios { get; set; }
        
    }
}