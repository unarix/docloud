using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace doCloud.Controllers
{
    [Route("api/[controller]")]
    public class DocumentTypeController : Controller
    {
        [HttpGet("[action]")]
        public List<DocumentType> GetDocumentTypes()
        {
            List<DocumentType> doctypeLst = new List<DocumentType>();

            var connString = "Host=127.0.0.1;Username=dar_user;Password=nar123;Database=dar";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * from dar_documento_tipo", conn))
                using (var dr = cmd.ExecuteReader())
                    while (dr.Read())
                    {
                        Console.WriteLine(dr.GetString(1));
                        
                        DocumentType docType = new DocumentType();
                        
                        docType.idns_documento_tipo = dr.IsDBNull(dr.GetOrdinal("idns_documento_tipo")) ? 0 : dr.GetDouble(dr.GetOrdinal("idns_documento_tipo"));
                        docType.sd_descripcion = dr.IsDBNull(dr.GetOrdinal("sd_descripcion")) ? "" : dr.GetString(dr.GetOrdinal("sd_descripcion"));
                        // docType.sd_descripcion = reader.GetString(1);
                        // docType.h_alta = (DateTime) reader.GetOrdinal("user_ruler_id");;
                        // docType.n_responsable = (int) reader.GetOrdinal("user_ruler_id");;
                        // docType.n_aeropuertos = (int) reader.GetOrdinal("user_ruler_id");;
                        // docType.n_clientes = (int) reader.GetOrdinal("user_ruler_id");;
                        // docType.n_destinatarios = (int) reader.GetOrdinal("user_ruler_id");;
                        
                        doctypeLst.Add(docType);
                    }
                        
            }


            return doctypeLst;
        }

        [HttpPost("[action]")]
        public string PostNewDocumentType(string sd_descripcion)
        {
            return("se creo la carpeta correctamente!");
        }
    }


}