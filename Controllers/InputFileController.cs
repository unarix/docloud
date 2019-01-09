using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;
using doCloud.Models;


namespace doCloud.Controllers
{
    
    [Route("api/[controller]")]
    public class InputFileController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;

        public InputFileController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public List<Models.File> GetAllFiles()
        {
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = Path.Combine(webRootPath, "Cloud/Input");

            DirectoryInfo d = new DirectoryInfo(newPath); //Assuming Test is your Folder
            FileInfo[] Files = d.GetFiles("*.pdf"); //Getting Text files

            List<Models.File> fls = new List<Models.File>();
            
            foreach(FileInfo file in Files )
            {
                doCloud.Models.File fileC = new doCloud.Models.File();
                fileC.LastWriteTime = file.LastWriteTime;
                fileC.Length = file.Length;
                fileC.name = file.Name;
                
                fls.Add(fileC);
            }
            
            return fls;
        }
    }
}