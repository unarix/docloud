using System;
using System.Configuration;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using doCloud.Models;
using Npgsql;

namespace doCloud.Controllers
{
    [Route("api/[controller]")]
    public class AtributesValueController : Controller
    {
        string connString = Startup.connectionString ;

        [HttpGet("{id:int}")]
        public List<AtributeValue> GetById(int id)
        {
            return getValuesByid(id);
        }

        private List<AtributeValue> getValuesByid(int id)
        {
            List<AtributeValue> attributeValueLst = new List<AtributeValue>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT * FROM dar_atributo_valor where ns_documento = :ns_documento", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("ns_documento", id));

                    using (var dr = cmd.ExecuteReader())
                        while (dr.Read())
                        {
                            Console.WriteLine(dr.GetString(1));
                            
                            AtributeValue atribTp = new AtributeValue();
                            
                            atribTp.idns_atributo_valor = dr.IsDBNull(dr.GetOrdinal("idns_atributo_tipo")) ? 0 : dr.GetInt32(dr.GetOrdinal("idns_atributo_tipo"));
                            atribTp.ns_atributo = dr.IsDBNull(dr.GetOrdinal("ns_atributo")) ? 0 : dr.GetInt32(dr.GetOrdinal("ns_atributo"));
                            atribTp.ns_documento = dr.IsDBNull(dr.GetOrdinal("ns_documento")) ? 0 : dr.GetInt32(dr.GetOrdinal("ns_documento"));
                            atribTp.ns_valor = dr.IsDBNull(dr.GetOrdinal("ns_valor")) ? 0 : dr.GetInt32(dr.GetOrdinal("ns_valor"));
                            atribTp.sd_valor = dr.IsDBNull(dr.GetOrdinal("sd_valor")) ? "" : dr.GetString(dr.GetOrdinal("sd_valor"));
                            atribTp.h_valor = dr.IsDBNull(dr.GetOrdinal("h_valor")) ? DateTime.Now : dr.GetDateTime(dr.GetOrdinal("h_valor"));
                            atribTp.h_fecha_alta = dr.IsDBNull(dr.GetOrdinal("h_fecha_alta")) ?  DateTime.Now : dr.GetDateTime(dr.GetOrdinal("h_fecha_alta"));
                            
                            attributeValueLst.Add(atribTp);
                        }
                }           
            }

            return attributeValueLst;
        }


        [HttpPost("[action]")]
        [Route("InsertAtributeValue")]
        public AtributeValue InsertAtributeValue([FromBody] List<AtributeValue> atrValues)
        {

            foreach( AtributeValue atr in atrValues)
            {
                using (var conn = new NpgsqlConnection(connString))
                {
                    conn.Open();

                    // Retrieve all rows
                    using (var cmd = new NpgsqlCommand("INSERT INTO DAR_ATRIBUTO_VALOR (NS_ATRIBUTO,SD_VALOR,NS_DOCUMENTO,H_FECHA_LTA,H_VALOR,NS_VALOR) VALUES (:NS_ATRIBUTO,:SD_VALOR,:NS_DOCUMENTO,:H_FECHA_LTA,:H_VALOR,:NS_VALOR)", conn))
                    {
                        cmd.Parameters.Add(new NpgsqlParameter("NS_ATRIBUTO", atr.ns_atributo));
                        cmd.Parameters.Add(new NpgsqlParameter("SD_VALOR", atr.sd_valor));
                        cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO", atr.ns_documento));
                        cmd.Parameters.Add(new NpgsqlParameter("H_FECHA_LTA", atr.h_fecha_alta));
                        cmd.Parameters.Add(new NpgsqlParameter("H_VALOR", atr.h_valor));
                        cmd.Parameters.Add(new NpgsqlParameter("NS_VALOR", atr.ns_valor));
                        cmd.ExecuteNonQuery();
                    }           
                }
            }

            AtributeValue atribval = new AtributeValue();
            atribval.sd_valor = "Se crearon los atributos correctamente";
            return atribval;
        }
    }
}
