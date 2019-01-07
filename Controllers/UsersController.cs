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
                                User.telefono = dr.IsDBNull(dr.GetOrdinal("telefono")) ? "" : dr.GetString(dr.GetOrdinal("telefono"));
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
