using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using doCloud.Models;

namespace doCloud.Controllers
{
    [Route("api/[controller]")]
    public class DocumentController : Controller
    {
        string connString = Startup.connectionString ;

        // Obtiene una lista de documentos por documento tipo (carpeta)
        [HttpGet("{id:int}")]
        public List<Document> GetById(int id)
        {
            List<Document> DocLst = new List<Document>();

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Retrieve all rows
                using (var cmd = new NpgsqlCommand("SELECT * from dar_documento Where ns_documento_tipo = :ns_documento_tipo", conn))
                {
                    cmd.Parameters.Add(new NpgsqlParameter("ns_documento_tipo", id));

                    using (var dr = cmd.ExecuteReader())
                    while (dr.Read())
                    {
                        Document doc = new Document();

                        doc.idns_documento = dr.IsDBNull(dr.GetOrdinal("IDNS_DOCUMENTO")) ? 0 : dr.GetInt32(dr.GetOrdinal("IDNS_DOCUMENTO"));
                        doc.h_fecha = dr.IsDBNull(dr.GetOrdinal("H_FECHA")) ? DateTime.Now : dr.GetDateTime(dr.GetOrdinal("H_FECHA"));
                        doc.ns_documento_fs = dr.IsDBNull(dr.GetOrdinal("NS_DOCUMENTO_TIPO")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_DOCUMENTO_TIPO"));
                        doc.ns_flow = dr.IsDBNull(dr.GetOrdinal("NS_FLOW")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_FLOW"));
                        doc.ns_usuario_carga = dr.IsDBNull(dr.GetOrdinal("NS_USUARIO_CARGA")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_USUARIO_CARGA"));
                        doc.sd_metadata = dr.IsDBNull(dr.GetOrdinal("SD_METADATA")) ? "" : dr.GetString(dr.GetOrdinal("SD_METADATA"));
                        doc.ns_documento_fs = dr.IsDBNull(dr.GetOrdinal("NS_DOCUMENTO_FS")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_DOCUMENTO_FS"));
                        doc.ns_documento_subtipo = dr.IsDBNull(dr.GetOrdinal("NS_DOCUMENTO_SUBTIPO")) ? 0 : dr.GetInt32(dr.GetOrdinal("NS_DOCUMENTO_SUBTIPO"));
                        doc.sd_nulo = dr.IsDBNull(dr.GetOrdinal("SD_NULO")) ? "" : dr.GetString(dr.GetOrdinal("SD_NULO"));

                        DocLst.Add(doc);
                    }
                }     
            }

            foreach(Document doc in DocLst)
            {
                using (var conn = new NpgsqlConnection(connString))
                {
                    conn.Open();

                    // Cargo los atributos por cada documento obtenido
                    List<AtributeValue> atrvals = new List<AtributeValue>();
                    using (var cmd2 = new NpgsqlCommand("SELECT * from dar_atributo_valor Where ns_documento = :ns_documento", conn))
                    {
                        cmd2.Parameters.Add(new NpgsqlParameter("ns_documento", doc.idns_documento));

                        using (var dr2 = cmd2.ExecuteReader())
                        while (dr2.Read())
                        {
                            AtributeValue atrval = new AtributeValue();

                            atrval.idns_atributo_valor = dr2.IsDBNull(dr2.GetOrdinal("idns_atributo_valor")) ? 0 : dr2.GetInt32(dr2.GetOrdinal("idns_atributo_valor"));
                            atrval.ns_atributo = dr2.IsDBNull(dr2.GetOrdinal("ns_atributo")) ? 0: dr2.GetInt32(dr2.GetOrdinal("ns_atributo"));
                            atrval.sd_valor = dr2.IsDBNull(dr2.GetOrdinal("sd_valor")) ? "" : dr2.GetString(dr2.GetOrdinal("sd_valor"));
                            atrval.ns_documento = dr2.IsDBNull(dr2.GetOrdinal("ns_documento")) ? 0 : dr2.GetInt32(dr2.GetOrdinal("ns_documento"));
                            atrval.h_fecha_alta = dr2.IsDBNull(dr2.GetOrdinal("h_fecha_alta")) ? DateTime.Now : dr2.GetDateTime(dr2.GetOrdinal("h_fecha_alta"));
                            atrval.h_valor = dr2.IsDBNull(dr2.GetOrdinal("h_valor")) ? DateTime.Now : dr2.GetDateTime(dr2.GetOrdinal("h_valor"));
                            atrval.ns_valor = dr2.IsDBNull(dr2.GetOrdinal("ns_valor")) ? 0 : dr2.GetInt32(dr2.GetOrdinal("ns_valor"));

                            atrvals.Add(atrval);
                        }
                    }  

                    doc.atriutos = atrvals;
                }
            }

            return DocLst;
        }


        [HttpPost]
        [Route("NewDocumentType")]
        public Document NewDocument([FromBody] Document doc)
        {
            try
            {
                if(doc.ns_documento_tipo != 0)
                {
                    string qry = "INSERT INTO DAR_DOCUMENTO (H_FECHA,NS_DOCUMENTO_TIPO,NS_USUARIO_CARGA,SD_METADATA,NS_DOCUMENTO_FS,NS_DOCUMENTO_SUBTIPO,SD_NULO) VALUES (current_timestamp,:NS_DOCUMENTO_TIPO,0,'',0,0,'1')";

                    using (var conn = new NpgsqlConnection(connString))
                    {
                        conn.Open();

                        //using (var cmd = new NpgsqlCommand("insert into login (Name, Password) values(:name, :pw)", conn))
                        using (var cmd = new NpgsqlCommand(qry, conn))
                        {
                            cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO_TIPO", doc.ns_documento_tipo));
                            cmd.ExecuteNonQuery();
                        }
                    }

                    Document Docu = new Document();
                    Docu.sd_metadata = "Se creo el documento tipo " + doc.ns_documento_tipo + " correctamente...";
                    return Docu;
                }
                else
                {
                    Document Docu = new Document();
                    Docu.sd_metadata = "Error, no se cargo el nombre de la nueva carpeta";
                    return Docu;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public Document insertDocument(Document doc)
        {
            try
            {
                Object res;

                if(doc.ns_documento_tipo != 0)
                {
                    string qry = "INSERT INTO DAR_DOCUMENTO (H_FECHA,NS_DOCUMENTO_TIPO,NS_USUARIO_CARGA,SD_METADATA,NS_DOCUMENTO_FS,NS_DOCUMENTO_SUBTIPO,SD_NULO) VALUES (current_timestamp,:NS_DOCUMENTO_TIPO,0,'',0,0,'1') RETURNING idns_documento";

                    using (var conn = new NpgsqlConnection(connString))
                    {
                        conn.Open();

                        //using (var cmd = new NpgsqlCommand("insert into login (Name, Password) values(:name, :pw)", conn))
                        using (var cmd = new NpgsqlCommand(qry, conn))
                        {
                            cmd.Parameters.Add(new NpgsqlParameter("NS_DOCUMENTO_TIPO", doc.ns_documento_tipo));
                            res = cmd.ExecuteScalar();
                        }
                    }

                    Document Docu = new Document();
                    Docu.idns_documento = int.Parse(res.ToString());
                    Docu.sd_metadata = "Se creo el documento tipo " + doc.ns_documento_tipo + " correctamente...";
                    return Docu;
                }
                else
                {
                    Document Docu = new Document();
                    Docu.sd_metadata = "Error, no se cargo el nombre de la nueva carpeta";
                    return Docu;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}