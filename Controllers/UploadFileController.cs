using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;
using System.Drawing.Imaging;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using NReco;
using doCloud.Models;
using Tesseract;

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

        // Inserta un documento en la base de datos
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile()   
        {
            
            string id_doc_type = Request.Form["inds_"];
            
            Document doc = new Document();
            doc.ns_documento_tipo = int.Parse(id_doc_type);

            DocumentController docCtrl = new DocumentController();
            doc = docCtrl.insertDocument(doc);

            string fullPath = "";
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
                    fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                // Generate the Thhumbail                
                var pdfFile = fullPath;
                var pdfToImg = new NReco.PdfRenderer.PdfToImageConverter();
                pdfToImg.ScaleTo = 140; // fit 200x200 box
                //pdfToImg.GenerateImage( pdfFile, 1, ImageFormat.Jpeg, "Sample1.jpg" );
                System.Drawing.Image img = pdfToImg.GenerateImage(pdfFile,1);
                img.Save(fullPath.Replace(".pdf",".gif"), System.Drawing.Imaging.ImageFormat.Gif);


                //var text = GetText(fullPath);

                return Json(doc.idns_documento);
            }
            catch (System.Exception ex)
            {
                return Json("Ha ocurrido un error al subir el archivo: " + ex.Message);
            }
        }

        
        [HttpPost, DisableRequestSizeLimit]
        [Route("UploadInputFile")]
        public ActionResult UploadInputFile()   
        {
            
            string fullPath = "";
            string fileName = "";
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "Cloud/Input";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    
                    fileName =  ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                
                return Json("El documento se cargo correctamente");
            }
            catch (System.Exception ex)
            {
                return Json("Ha ocurrido un error al subir el archivo: " + ex.Message);
            }
        }

        public string GetText(string fullPath)
        {
			using (var engine = new TesseractEngine(@"/home/unarix/Documentos/code/docloud/docloud/wwwroot/tessdata", "eng", EngineMode.Default)) {
				var inputFilename = fullPath;
				using (var img = Pix.LoadFromFile(inputFilename)) {
					using (var page = engine.Process(img, inputFilename, PageSegMode.SingleLine)) {
						var text = page.GetText();
                        return text;
					}
				}
			}
        }
    }
}