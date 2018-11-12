using System;

namespace doCloud.Models
{
    public class Document
    {
        public int idns_documento { get; set; }
        public DateTime h_fecha { get; set; }
        public int ns_documento_tipo { get; set; }
        public int ns_flow  { get; set; }
        public int ns_usuario_carga { get; set; }
        public string sd_metadata { get; set; }
        public int ns_documento_fs  { get; set; }
        public int ns_documento_subtipo  { get; set; }
        public string sd_nulo  { get; set; }
        
    }
}