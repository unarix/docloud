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
    public class AtributesController : Controller
    {
        string connString = Startup.connectionString ;


        [HttpGet("{id:int}")]
        public List<Atribute> GetById(int id)
        {
            Atribute atr = new Atribute();
            atr.ns_documento_tipo = id;

            List<Atribute> attributesLst = new List<Atribute>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * FROM DAR_ATRIBUTO WHERE NS_DOCUMENTO_TIPO = :ns_doc_tipo", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("ns_doc_tipo", atr.ns_documento_tipo));

                    using (var dr = cmd.ExecuteReader())
                        while (dr.Read())
                        {
                            Console.WriteLine(dr.GetString(1));
                            
                            Atribute atrib = new Atribute();
                            
                            atrib.idns_atributo = dr.IsDBNull(dr.GetOrdinal("IDNS_ATRIBUTO")) ? 0 : dr.GetInt32(dr.GetOrdinal("IDNS_ATRIBUTO"));
                            atrib.sd_atributo = dr.IsDBNull(dr.GetOrdinal("SD_ATRIBUTO")) ? "" : dr.GetString(dr.GetOrdinal("SD_ATRIBUTO"));
                            atrib.ns_documento_tipo = dr.IsDBNull(dr.GetOrdinal("NS_DOCUMENTO_TIPO")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_DOCUMENTO_TIPO"));
                            atrib.ns_atributo_tipo = dr.IsDBNull(dr.GetOrdinal("NS_ATRIBUTO_TIPO")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_ATRIBUTO_TIPO"));
                            atrib.h_alta = dr.IsDBNull(dr.GetOrdinal("H_ALTA")) ? DateTime.Now : dr.GetDateTime(dr.GetOrdinal("H_ALTA"));
                            atrib.sd_opciones = dr.IsDBNull(dr.GetOrdinal("SD_OPCIONES")) ? "" : dr.GetString(dr.GetOrdinal("SD_OPCIONES"));
                            
                            
                            attributesLst.Add(atrib);
                        }
                }           
            }


            return attributesLst;
        }
                
        [HttpPost("[action]")]
        [Route("InsertAtribute")]
        public Atribute InsertAtribute([FromBody] Atribute atr)
        {
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("INSERT INTO DAR_ATRIBUTO (SD_ATRIBUTO,NS_DOCUMENTO_TIPO,NS_ATRIBUTO_TIPO,H_ALTA,SD_OPCIONES) VALUES (:SD_ATRIBUTO,:NS_DOCUMENTO_TIPO,:NS_ATRIBUTO_TIPO,:H_ALTA,:SD_OPCIONES)", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("SD_ATRIBUTO", atr.sd_atributo));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO_TIPO", atr.ns_documento_tipo));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_ATRIBUTO_TIPO", atr.ns_atributo_tipo));
                    cmd.Parameters.Add(new NpgsqlParameter("H_ALTA", atr.h_alta));
                    cmd.Parameters.Add(new NpgsqlParameter("SD_OPCIONES", atr.sd_opciones));
                    cmd.ExecuteNonQuery();
                }           
            }
            Atribute atrib = new Atribute();
            atrib.sd_atributo = "Se creo el atributo correctamente";
            return atrib;
        }

        [HttpPost("[action]")]
        [Route("UpdateAtribute")]
        public List<Atribute> UpdateAtribute([FromBody] Atribute atr)
        {
            List<Atribute> attributesLst = new List<Atribute>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("UPDATE DAR_ATRIBUTO set (SD_ATRIBUTO, NS_DOCUMENTO_TIPO, NS_ATRIBUTO_TIPO, H_ALTA, SD_OPCIONES) = (:SD_ATRIBUTO,:NS_DOCUMENTO_TIPO,:NS_ATRIBUTO_TIPO,:H_ALTA,:SD_OPCIONES) WHERE IDNS_ATRIBUTO = :IDNS_ATRIBUTO", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("IDNS_ATRIBUTO", atr.idns_atributo));
                    cmd.Parameters.Add(new NpgsqlParameter("SD_ATRIBUTO", atr.sd_atributo));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO_TIPO", atr.ns_documento_tipo));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_ATRIBUTO_TIPO", atr.ns_atributo_tipo));
                    cmd.Parameters.Add(new NpgsqlParameter("H_ALTA", atr.h_alta));
                    cmd.Parameters.Add(new NpgsqlParameter("SD_OPCIONES", atr.sd_opciones));
                    cmd.ExecuteNonQuery();
                }           
            }
            
            return attributesLst;
        }

        [HttpPost("[action]")]
        [Route("DeleteAtribute")]
        public List<Atribute> DeleteAtribute([FromBody] Atribute atr)
        {
            List<Atribute> attributesLst = new List<Atribute>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("DELETE FROM DAR_ATRIBUTO WHERE IDNS_ATRIBUTO = :IDNS_ATRIBUTO", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("IDNS_ATRIBUTO", atr.idns_atributo));
                    cmd.ExecuteNonQuery();
                }           
            }
            
            return attributesLst;
        }

    }
}
