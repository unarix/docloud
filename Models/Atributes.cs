using System;
using Npgsql;
using doCloud.Support.NpgSQL;

namespace doCloud.Models
{
    public class Atribute
    {
        #region Properties

        public int idns_atributo { get; set; }
        public string sd_atributo { get; set; }
        public int ns_documento_tipo { get; set; }
        public int ns_atributo_tipo { get; set; }
        public DateTime h_alta { get; set; }
        public string sd_opciones { get; set; }

        #endregion

        #region Constructors

        public Atribute(){}

        public Atribute(NpgsqlDataReader pDR)
        {
            try
            {
                this.idns_atributo = DataTools.ReplaceDBNull<int>(pDR["IDNS_ATRIBUTO"], 0);
                this.sd_atributo = DataTools.ReplaceDBNull<string>(pDR["SD_ATRIBUTO"], string.Empty);
                this.ns_documento_tipo = DataTools.ReplaceDBNull<int>(pDR["NS_DOCUMENTO_TIPO"], 0);
                this.ns_atributo_tipo = DataTools.ReplaceDBNull<int>(pDR["NS_ATRIBUTO_TIPO"], 0);
                this.h_alta = DataTools.ReplaceDBNull<DateTime>(pDR["H_ALTA"], DateTime.Now);
                this.sd_opciones = DataTools.ReplaceDBNull<string>(pDR["SD_OPCIONES"], string.Empty);
            }
            catch (System.Exception ex) { throw ex; }
        }

        public Atribute(int pIdns, string pSd, int pDocumentType, int pAttributeType, DateTime pCreateDate, string pOptions)
        {
            try
            {
                this.idns_atributo = pIdns;
                this.sd_atributo = pSd;
                this.ns_documento_tipo = pDocumentType;
                this.ns_atributo_tipo = pAttributeType;
                this.h_alta = pCreateDate;
                this.sd_opciones = pOptions;
            }
            catch (System.Exception ex) { throw ex; }
        }

        #endregion
    }
}