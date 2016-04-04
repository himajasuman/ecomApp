using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using EcomApp.App_Start;

namespace EcomApp
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
           //StorageCROS.AddCorsRuleStorageClientLibrary();
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}