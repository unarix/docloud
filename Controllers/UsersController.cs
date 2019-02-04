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
    public class UsersController : Controller
    {
        string connString = Startup.connectionString;


        [HttpGet]
        [Route("GetAllUsers")]

        public List<User> GetAllUsers()
        {
            try
            {
                List<User> UserLst = new List<User>();

                using (var conn = new NpgsqlConnection(connString))
                {
                    conn.Open();

                    // Retrieve all rows
                    using (var cmd = new NpgsqlCommand("SELECT * FROM DAR_USUARIOS", conn))
                    {
                        using (var dr = cmd.ExecuteReader())
                            while (dr.Read())
                            {
                                Console.WriteLine(dr.GetString(1));

                                User User = new User();

                                User.usuario_id = dr.IsDBNull(dr.GetOrdinal("usuario_id")) ? 0 : dr.GetInt32(dr.GetOrdinal("usuario_id"));
                                User.usuario = dr.IsDBNull(dr.GetOrdinal("usuario")) ? "" : dr.GetString(dr.GetOrdinal("usuario"));
                                User.password = dr.IsDBNull(dr.GetOrdinal("password")) ? "" : dr.GetString(dr.GetOrdinal("password"));
                                User.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? "" : dr.GetString(dr.GetOrdinal("nombre"));
                                User.apellido = dr.IsDBNull(dr.GetOrdinal("apellido")) ? "" : dr.GetString(dr.GetOrdinal("apellido"));
                                User.telefono = dr.IsDBNull(dr.GetOrdinal("telefono")) ? "": dr.GetString(dr.GetOrdinal("telefono"));
                                User.email = dr.IsDBNull(dr.GetOrdinal("email")) ? "" : dr.GetString(dr.GetOrdinal("email"));
                                User.documento = dr.IsDBNull(dr.GetOrdinal("documento")) ? 0 : dr.GetInt32(dr.GetOrdinal("documento"));

                                UserLst.Add(User);
                            }
                    }

                    return UserLst;
                }
            }
            catch (System.Exception ex) { throw ex; }
        }



        [HttpGet("{id:int}")]
        public User GetUserById(int id)
        {
            User us = new User();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * FROM DAR_USUARIOS WHERE USUARIO_ID = :id", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("USUARIO_ID", id));

                    using (var dr = cmd.ExecuteReader())
                        while (dr.Read())
                        {
                            Console.WriteLine(dr.GetString(1));
                            us.usuario_id = dr.IsDBNull(dr.GetOrdinal("usuario_id")) ? 0 : dr.GetInt32(dr.GetOrdinal("usuario_id"));
                            us.usuario = dr.IsDBNull(dr.GetOrdinal("usuario")) ? "" : dr.GetString(dr.GetOrdinal("usuario"));
                            us.password = dr.IsDBNull(dr.GetOrdinal("password")) ? "" : dr.GetString(dr.GetOrdinal("password"));
                            us.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? "" : dr.GetString(dr.GetOrdinal("nombre"));
                            us.apellido = dr.IsDBNull(dr.GetOrdinal("apellido")) ? "" : dr.GetString(dr.GetOrdinal("apellido"));
                            us.telefono = dr.IsDBNull(dr.GetOrdinal("telefono")) ? "" : dr.GetString(dr.GetOrdinal("telefono"));
                            us.email = dr.IsDBNull(dr.GetOrdinal("email")) ? "" : dr.GetString(dr.GetOrdinal("email"));
                            us.documento = dr.IsDBNull(dr.GetOrdinal("documento")) ? 0 : dr.GetInt32(dr.GetOrdinal("documento"));

                        }
                }
            }


            return us;
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
