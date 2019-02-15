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
    public class FamilyController : Controller
    {
        string connString = Startup.connectionString;

    

        [HttpGet]
        [Route("GetAllFamilies")]

        public List<Family> GetAllFamilies()
        {
            try
            {
                List<Family> ProfLst = new List<Family>();

                using (var conn = new NpgsqlConnection(connString))
                {
                    conn.Open();

                    // Retrieve all rows
                    using (var cmd = new NpgsqlCommand("SELECT * FROM DAR_FAMILIA", conn))
                    {
                        using (var dr = cmd.ExecuteReader())
                            while (dr.Read())
                            {
                                Console.WriteLine(dr.GetString(1));

                                Family Fam = new Family();

                                Fam.familia_id = dr.IsDBNull(dr.GetOrdinal("familia_id")) ? 0 : dr.GetDouble(dr.GetOrdinal("familia_id"));
                                Fam.descripcion = dr.IsDBNull(dr.GetOrdinal("descripcion")) ? "" : dr.GetString(dr.GetOrdinal("descripcion"));


                                ProfLst.Add(Fam);
                            }
                    }

                    return ProfLst;
                }
            }
            catch (System.Exception ex) { throw ex; }
        }



        [HttpGet("{id:int}")]
        public Family GetFamilyById(int id)
        {
            Family fam = new Family();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * FROM DAR_FAMILIA WHERE FAMILIA_ID = :id", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("FAMILIA_ID", id));

                    using (var dr = cmd.ExecuteReader())
                        while (dr.Read())
                        {
                            fam.familia_id = dr.IsDBNull(dr.GetOrdinal("familia_id")) ? 0 : dr.GetInt32(dr.GetOrdinal("familia_id"));
                            fam.descripcion = dr.IsDBNull(dr.GetOrdinal("descripcion")) ? "" : dr.GetString(dr.GetOrdinal("descripcion"));                            

                        }
                }
            }


            return fam;
        }

        [HttpPost("[action]")]
        [Route("InsertFamily")]
        public bool InsertFamily([FromBody] Family fa)
        {
            
           try
           {
                using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("INSERT INTO DAR_FAMILIA (descripcion) VALUES (:p_Descripcion)", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("p_Descripcion",  fa.descripcion));                    
                    
                    cmd.ExecuteNonQuery();
                }
            }

            return true;
           }
           catch (System.Exception ex)
           {
               
               throw ex;
           }
        }

        [HttpPost("[action]")]
        [Route("UpdateFamily")]
        public bool UpdateUser([FromBody] Family fa)
        {
            try
            {
                 using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("UPDATE DAR_FAMILIA set DESCRIPCION = :p_descripcion WHERE FAMILIA_ID = :p_familia_id", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("p_familia_id", fa.familia_id));
                    cmd.Parameters.Add(new NpgsqlParameter("p_descripcion", fa.descripcion));
                    

                    cmd.ExecuteNonQuery();
                }
            }

            return true;
            }
            catch (System.Exception ex)
            {
                
                throw ex;
            }
           
        }

        [HttpGet("{id:int}")]
        [Route("DeleteFamily")]
        public bool DeleteFamily(int id)
        {           

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("DELETE FROM DAR_FAMILIA WHERE FAMILIA_ID = :FAMILIA_ID", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("FAMILIA_ID", id));
                    cmd.ExecuteNonQuery();
                }
            }

            return true;
        }

        [HttpPost("[action]")]
        [Route("AsocTipoDocs")]
        public bool AsocTipoDocs([FromBody] Family Fam)
        {

            try
            {
                using (var conn = new NpgsqlConnection(connString))
                {
                    conn.Open();

                    using (var cmd = new NpgsqlCommand("DELETE FROM DAR_FAMILIA_DOC_TIPO WHERE ns_familia = :p_familia_id", conn))
                    {
                        cmd.Parameters.Add(new NpgsqlParameter("p_familia_id", Fam.familia_id));
                        cmd.ExecuteNonQuery();
                    }


                    foreach (var doctype in Fam.doc_types)
                    {
                        // Retrieve all rows
                        using (var cmd = new NpgsqlCommand("INSERT INTO DAR_FAMILIA_DOC_TIPO (ns_familia, ns_documento_tipo) VALUES (:p_family_id, :p_doctype_id)", conn))
                        {

                            cmd.Parameters.Add(new NpgsqlParameter("p_doctype_id", doctype.idns_documento_tipo));
                            cmd.Parameters.Add(new NpgsqlParameter("p_family_id", Fam.familia_id));

                            cmd.ExecuteNonQuery();
                        }

                    }


                }

                return true;
            }
            catch (NpgsqlException ex)
            {

                throw ex;
            }
        }

        [HttpGet("{id:int}")]
        [Route("GetAsocTipoDocs")]
        public Family GetAsocTipoDocs(int idFamilia)
        {
            try
            {
                Family fam = new Family();

                List<DocumentType> TiDocLst = new List<DocumentType>();

                fam.doc_types = TiDocLst;


                using (var conn = new NpgsqlConnection(connString))
                {
                    conn.Open();


                    using (var cmd = new NpgsqlCommand("SELECT FDT.NS_FAMILIA, DT.SD_DESCRIPCION FROM DAR_FAMILIA_DOC_TIPO FDT INNER JOIN DAR_DOCUMENTO_TIPO DT ON FDT.ns_documento_tipo = DT.idns_documento_tipo where FDT.ns_familia = :FAMILIA_ID", conn))
                    {
                        cmd.Parameters.Add(new NpgsqlParameter("FAMILIA_ID", idFamilia));

                        using (var dr = cmd.ExecuteReader())

                            while (dr.Read())
                            {
                                DocumentType DocTyp = new DocumentType();

                                DocTyp.idns_documento_tipo = dr.IsDBNull(dr.GetOrdinal("NS_FAMILIA")) ? 0 : dr.GetDouble(dr.GetOrdinal("NS_FAMILIA"));
                                DocTyp.sd_descripcion = dr.IsDBNull(dr.GetOrdinal("SD_DESCRIPCION")) ? "" : dr.GetString(dr.GetOrdinal("SD_DESCRIPCION"));
                                TiDocLst.Add(DocTyp);
                            }
                    }

                    return fam;
                }
            }
            catch (System.Exception ex) { throw ex; }

        }

    }
}
