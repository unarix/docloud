using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;
using doCloud.Models;

namespace doCloud.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UploadFileController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;

        public UploadFileController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        
        // Sube un documento a la bandeja inbox
        // [HttpPost, DisableRequestSizeLimit]
        // public ActionResult UploadFile()   
        // {
        //     string fileName = "";
        //     try
        //     {
        //         var file = Request.Form.Files[0];
        //         string folderName = "Upload";
        //         string webRootPath = _hostingEnvironment.WebRootPath;
        //         string newPath = Path.Combine(webRootPath, folderName);
        //         if (!Directory.Exists(newPath))
        //         {
        //             Directory.CreateDirectory(newPath);
        //         }
        //         if (file.Length > 0)
        //         {
        //             fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        //             string fullPath = Path.Combine(newPath, fileName);
        //             using (var stream = new FileStream(fullPath, FileMode.Create))
        //             {
        //                 file.CopyTo(stream);
        //             }
        //         }
        //         return Json("El archivo " + fileName + " se ha subido correctamente!");
        //     }
        //     catch (System.Exception ex)
        //     {
        //         return Json("Ha ocurrido un error al subir el archivo: " + ex.Message);
        //     }
        // }

        // Inserta un documento en la base de datos
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile()   
        {
            
            string id_doc_type = Request.Form["inds_"];
            
            Document doc = new Document();
            doc.ns_documento_tipo = int.Parse(id_doc_type);

            DocumentController docCtrl = new DocumentController();
            doc = docCtrl.insertDocument(doc);

            string fileName = "";
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "Cloud/" + DateTime.Now.Year + "/" + DateTime.Now.Month + "/" + DateTime.Now.Day;
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    
                    fileName = doc.idns_documento.ToString() + System.IO.Path.GetExtension(file.FileName); //ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Json(doc.idns_documento);
            }
            catch (System.Exception ex)
            {
                return Json("Ha ocurrido un error al subir el archivo: " + ex.Message);
            }
        }
    }
}