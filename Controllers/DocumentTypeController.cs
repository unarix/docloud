using System;
using System.Web;
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
        string connString = "Host=127.0.0.1;Username=dar_user;Password=nar123;Database=dar";

        [HttpGet("[action]")]
        public List<DocumentType> GetDocumentTypes()
        {
            List<DocumentType> doctypeLst = new List<DocumentType>();

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

        [HttpPost]
        [Route("NewDocumentType")]
        public DocumentType NewDocumentType([FromBody] DocumentType doc)
        {
            try
            {
                if(doc.sd_descripcion!= "")
                {
                    string qry = "insert into dar_documento_tipo (SD_DESCRIPCION, H_ALTA, N_RESPONSABILIDADES, N_AEROPUERTOS, N_CLIENTES, N_DESTINATARIOS) values (:sd_desc ,current_timestamp, 0,0,0,0)";

                    using (var conn = new NpgsqlConnection(connString))
                    {
                        conn.Open();

                        //using (var cmd = new NpgsqlCommand("insert into login (Name, Password) values(:name, :pw)", conn))
                        using (var cmd = new NpgsqlCommand(qry, conn))
                        {
                            cmd.Parameters.Add(new NpgsqlParameter("sd_desc", doc.sd_descripcion));
                            cmd.ExecuteNonQuery();
                        }
                    }

                    DocumentType Docu = new DocumentType();
                    Docu.sd_descripcion = "Se creo la carpeta " + doc.sd_descripcion + " correctamente...";
                    return Docu;
                }
                else
                {
                    DocumentType Docu = new DocumentType();
                    Docu.idns_documento_tipo = 0;
                    Docu.sd_descripcion = "Error, no se cargo el nombre de la nueva carpeta";
                    return Docu;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Route("DeleteDocumentType")]
        public IActionResult DeleteDocumentType([FromBody] DocumentType doc)
        {
            try
            {
                if(doc.idns_documento_tipo!=0)
                {
                    string qry = "delete from dar_documento_tipo where idns_documento_tipo = :id";

                    using (var conn = new NpgsqlConnection(connString))
                    {
                        conn.Open();

                        //using (var cmd = new NpgsqlCommand("insert into login (Name, Password) values(:name, :pw)", conn))
                        using (var cmd = new NpgsqlCommand(qry, conn))
                        {
                            cmd.Parameters.Add(new NpgsqlParameter("id", doc.idns_documento_tipo));
                            cmd.ExecuteNonQuery();
                        }
                    }                    
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }


            return NoContent();
        }

    }

}