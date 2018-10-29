using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;

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
         
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile()   
        {
            string fileName = "";
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Json("El archivo " + fileName + " se ha subido correctamente!");
            }
            catch (System.Exception ex)
            {
                return Json("Ha ocurrido un error al subir el archivo: " + ex.Message);
            }
        }
    }
}