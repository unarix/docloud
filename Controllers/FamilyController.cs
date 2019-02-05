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

                                Fam.familia_id = dr.IsDBNull(dr.GetOrdinal("familia_id")) ? 0 : dr.GetInt32(dr.GetOrdinal("familia_id"));
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
        [Route("InsertUser")]
        public bool InsertUser([FromBody] User us)
        {
            
           try
           {
                using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("INSERT INTO DAR_USUARIOS (usuario, password, nombre, apellido, telefono, email, documento ) VALUES (:p_usuario, :password, :p_nombre, :p_apellido, :p_telefono, :p_email, :p_documento)", conn))
                {
 
                    cmd.Parameters.Add(new NpgsqlParameter("p_usuario",  us.usuario));
                    cmd.Parameters.Add(new NpgsqlParameter("p_password", us.password ));
                    cmd.Parameters.Add(new NpgsqlParameter("p_nombre", us.nombre));
                    cmd.Parameters.Add(new NpgsqlParameter("p_apellido", us.apellido));
                    cmd.Parameters.Add(new NpgsqlParameter("p_telefono", us.telefono));
                    cmd.Parameters.Add(new NpgsqlParameter("p_email", us.email));
                    cmd.Parameters.Add(new NpgsqlParameter("p_documento",  us.documento));
                    
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
        [Route("UpdateUser")]
        public bool UpdateUser([FromBody] User us)
        {
            
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("UPDATE DAR_USERS set (USUARIO, NOMBRE, APELLIDO, TELEFONO, EMAIL) = (:p_usuario,:p_nombre,:p_apellido,:p_telefono,:p_email) WHERE USUARIO_ID = :p_usuario_id", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("p_usuario_id", us.usuario_id));
                    cmd.Parameters.Add(new NpgsqlParameter("p_usuario", us.usuario));
                    cmd.Parameters.Add(new NpgsqlParameter("p_nombre", us.nombre));
                    cmd.Parameters.Add(new NpgsqlParameter("p_apellido", us.apellido));
                    cmd.Parameters.Add(new NpgsqlParameter("p_telefono", us.telefono));
                    cmd.Parameters.Add(new NpgsqlParameter("p_email", us.email));

                    cmd.ExecuteNonQuery();
                }
            }

            return true;
        }

        [HttpGet("{id:int}")]
        [Route("DeleteUser")]
        public bool DeleteUser(int iduser)
        {           

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("DELETE FROM DAR_USUARIOS WHERE USUARIO_ID = :USUARIO_ID", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("USUARIO_ID", iduser));
                    cmd.ExecuteNonQuery();
                }
            }

            return true;
        }

    }
}
