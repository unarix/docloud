using System;
using System.Data;
using System.Collections.Generic;
using Npgsql;

namespace doCloud.Support.NpgSQL
{
    public class Connector
    {
        #region Properties

        private string sConnectionString { get; set; }

        #endregion

        #region Constructors

        public Connector(string pConnectionString)
        {
            this.sConnectionString = pConnectionString;
        }

        #endregion

        #region Connections Methods

        // Making connection with Npgsql provider
        public Npgsql.NpgsqlDataReader ExecuteStore(string pStoreProcedure, List<NpgsqlParameter> pLstParams)
        {
            try
            {
                using (NpgsqlConnection conn = new NpgsqlConnection(this.sConnectionString))
                {
                    conn.Open();

                    var trans = conn.BeginTransaction();
                    var cmd = new NpgsqlCommand("get_data_test", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Transaction = trans;

                    if(pLstParams != null)
                        cmd.Parameters.AddRange(pLstParams.ToArray());

                    return cmd.ExecuteReader();
                }
            }
            catch (System.Exception ex) { throw ex; }
        }

        #endregion
    }
}