using System;

namespace doCloud.Support.NpgSQL
{
    public static class DataTools
    {
        #region DBNull Methods

        // Replace DBNull by a default value
        public static T ReplaceDBNull<T>(object pField, T pDefaultValue)
        {
            try
            {
                if(pField.GetType() == DBNull.Value.GetType())
                    return (T)pDefaultValue;
                else
                    return (T)pField;
            }
            catch (System.Exception ex) { throw ex; }
        }

        // Thow an exception when a DBNull value is found
        public static T ThrowExceptionOnDBNull<T>(object pField, string pParamName)
        {
            try
            {
                if(pField.GetType() == DBNull.Value.GetType())
                    throw new ArgumentNullException(pParamName, string.Format("An error has ocurred when trying to get value from {0}", pParamName));
                else
                    return (T)pField;
            }
            catch (System.Exception ex) { throw ex; }
        }

        #endregion
    }
}