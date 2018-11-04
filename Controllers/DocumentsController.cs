using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace doCloud.Controllers
{
    [Route("api/[controller]")]
    public class DocumentsDataController : Controller
    {
        string connString = Startup.connectionString ;

        [HttpGet("[action]")]
        public List<Document> GetDocuments()
        {
            List<Document> DocLst = new List<Document>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * from dar_documento", conn))
                using (var reader = cmd.ExecuteReader())
                    while (reader.Read())
                    {
                        Console.WriteLine(reader.GetDouble(0));
                        Console.WriteLine(reader.GetString(1));
                        
                        Document doc = new Document();
                        doc.idns_aeropuerto = Convert.ToInt32(reader.GetDouble(0));
                        doc.sd_descripcion = reader.GetString(1);
                        
                        DocLst.Add(doc);
                    }
                        
            }

            return DocLst;
        }
    }
}