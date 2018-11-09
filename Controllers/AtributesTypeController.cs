using System;
using System.Configuration;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace doCloud.Controllers
{
    [Route("api/[controller]")]
    public class AtributesTypeController : Controller
    {
        string connString = Startup.connectionString ;


        [HttpGet]
        public List<AtributeType> GetAll()
        {

            List<AtributeType> attributeTypeLst = new List<AtributeType>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * FROM DAR_ATRIBUTO_TIPO", conn))
                {
                    using (var dr = cmd.ExecuteReader())
                        while (dr.Read())
                        {
                            Console.WriteLine(dr.GetString(1));
                            
                            AtributeType atribTp = new AtributeType();
                            
                            atribTp.idns_atributo_tipo = dr.IsDBNull(dr.GetOrdinal("idns_atributo_tipo")) ? 0 : dr.GetInt32(dr.GetOrdinal("idns_atributo_tipo"));
                            atribTp.sd_tipo = dr.IsDBNull(dr.GetOrdinal("sd_tipo")) ? "" : dr.GetString(dr.GetOrdinal("sd_tipo"));                            
                            
                            attributeTypeLst.Add(atribTp);
                        }
                }           
            }

            return attributeTypeLst;
        }
    }
}
