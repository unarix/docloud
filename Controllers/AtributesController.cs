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

        [HttpGet("[action]")]
        public List<Atributes> GetAtributesByDocumentId(Atributes atr)
        {
            List<Atributes> attributesLst = new List<Atributes>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * FROM DAR_ATRIBUTO WHERE NS_DOCUMENTO_TIPO = :ns_doc_tipo", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("ns_doc_tipo", atr.NS_DOCUMENTO_TIPO));

                    using (var dr = cmd.ExecuteReader())
                        while (dr.Read())
                        {
                            Console.WriteLine(dr.GetString(1));
                            
                            Atributes atrib = new Atributes();
                            
                            atrib.IDNS_ATRIBUTO = dr.IsDBNull(dr.GetOrdinal("IDNS_ATRIBUTO")) ? 0 : dr.GetInt32(dr.GetOrdinal("IDNS_ATRIBUTO"));
                            atrib.SD_ATRIBUTO = dr.IsDBNull(dr.GetOrdinal("SD_ATRIBUTO")) ? "" : dr.GetString(dr.GetOrdinal("SD_ATRIBUTO"));
                            atrib.NS_DOCUMENTO_TIPO = dr.IsDBNull(dr.GetOrdinal("NS_DOCUMENTO_TIPO")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_DOCUMENTO_TIPO"));
                            atrib.NS_ATRIBUTO_TIPO = dr.IsDBNull(dr.GetOrdinal("NS_ATRIBUTO_TIPO")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_ATRIBUTO_TIPO"));
                            atrib.H_ALTA = dr.IsDBNull(dr.GetOrdinal("H_ALTA")) ? DateTime.Now : dr.GetDateTime(dr.GetOrdinal("H_ALTA"));
                            atrib.SD_OPCIONES = dr.IsDBNull(dr.GetOrdinal("SD_OPCIONES")) ? "" : dr.GetString(dr.GetOrdinal("SD_OPCIONES"));
                            
                            
                            attributesLst.Add(atrib);
                        }
                }           
            }


            return attributesLst;
        }
        
        [HttpPost("[action]")]
        public List<Atributes> InsertAtribute(Atributes atr)
        {
            List<Atributes> attributesLst = new List<Atributes>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("INSERT INTO DAR_ATRIBUTO VALUES (:SD_ATRIBUTO,:NS_DOCUMENTO_TIPO,:NS_ATRIBUTO_TIPO,:H_ALTA,:SD_OPCIONES)", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("SD_ATRIBUTO", atr.SD_ATRIBUTO));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO_TIPO", atr.NS_DOCUMENTO_TIPO));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_ATRIBUTO_TIPO", atr.NS_ATRIBUTO_TIPO));
                    cmd.Parameters.Add(new NpgsqlParameter("H_ALTA", atr.H_ALTA));
                    cmd.Parameters.Add(new NpgsqlParameter("SD_OPCIONES", atr.SD_OPCIONES));
                    cmd.ExecuteNonQuery();
                }           
            }

            return attributesLst;
        }

        [HttpPost("[action]")]
        public List<Atributes> UpdateAtribute(Atributes atr)
        {
            List<Atributes> attributesLst = new List<Atributes>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("UPDATE DAR_ATRIBUTO set (SD_ATRIBUTO, NS_DOCUMENTO_TIPO, NS_ATRIBUTO_TIPO, H_ALTA, SD_OPCIONES) = (:SD_ATRIBUTO,:NS_DOCUMENTO_TIPO,:NS_ATRIBUTO_TIPO,:H_ALTA,:SD_OPCIONES) WHERE IDNS_ATRIBUTO = :IDNS_ATRIBUTO", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("IDNS_ATRIBUTO", atr.IDNS_ATRIBUTO));
                    cmd.Parameters.Add(new NpgsqlParameter("SD_ATRIBUTO", atr.SD_ATRIBUTO));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO_TIPO", atr.NS_DOCUMENTO_TIPO));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_ATRIBUTO_TIPO", atr.NS_ATRIBUTO_TIPO));
                    cmd.Parameters.Add(new NpgsqlParameter("H_ALTA", atr.H_ALTA));
                    cmd.Parameters.Add(new NpgsqlParameter("SD_OPCIONES", atr.SD_OPCIONES));
                    cmd.ExecuteNonQuery();
                }           
            }
            
            return attributesLst;
        }

        [HttpPost("[action]")]
        public List<Atributes> DeleteAtribute(Atributes atr)
        {
            List<Atributes> attributesLst = new List<Atributes>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("DELETE FROM DAR_ATRIBUTO WHERE IDNS_ATRIBUTO = :IDNS_ATRIBUTO", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("SD_ATRIBUTO", atr.SD_ATRIBUTO));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO_TIPO", atr.NS_DOCUMENTO_TIPO));
                    cmd.Parameters.Add(new NpgsqlParameter("NS_ATRIBUTO_TIPO", atr.NS_ATRIBUTO_TIPO));
                    cmd.Parameters.Add(new NpgsqlParameter("H_ALTA", atr.H_ALTA));
                    cmd.Parameters.Add(new NpgsqlParameter("SD_OPCIONES", atr.SD_OPCIONES));
                    cmd.ExecuteNonQuery();
                }           
            }
            
            return attributesLst;
        }

    }
}
