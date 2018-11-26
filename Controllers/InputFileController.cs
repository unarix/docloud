using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;
using doCloud.Models;


namespace doCloud.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class InputFileController : Controller
    {

        [HttpGet]
        public List<Models.File> GetAll()
        {
            DirectoryInfo d = new DirectoryInfo(@"Cloud\input\"); //Assuming Test is your Folder
            FileInfo[] Files = d.GetFiles("*.txt"); //Getting Text files
            string str = "";

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