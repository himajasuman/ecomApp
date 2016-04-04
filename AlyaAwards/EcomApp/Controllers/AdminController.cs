using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Web.Http.Cors;

namespace EcomApp.Controllers
{
    [EnableCors(origins : "*", headers: "*", methods: "*")]
    public class AdminController : ApiController
    {
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        [Route("admin/signup")]
        [HttpPost]
        public string adminSignUp([FromBody] Admin aData)
        {
            using (var ctx = new StoreDBEntities())
            {
                Admin x = (from p in ctx.Admins
                           where p.UserId == aData.UserId && p.Password == aData.Password
                           select p).FirstOrDefault();
                var result = "User not found!";
                if (x == null)
                {
                    try
                    {
                        ctx.Admins.Add(aData);
                        ctx.SaveChanges();
                        result = "Signup Successful!";
                    }catch(Exception e)
                    {
                        result = e.ToString();
                    }
                   
                }
                return result;

            }
        }

        [Route("admin/login")]
        [HttpPost]
        public string adminLogin([FromBody] Admin aData)
        {
            using (var ctx = new StoreDBEntities())
            {
                Admin x = (from p in ctx.Admins
                             where p.UserId == aData.UserId && p.Password == aData.Password
                           select p).FirstOrDefault();
                if(x != null)
                {
                    return serializer.Serialize(x);
                }
                else
                {
                    return serializer.Serialize("User not found!");
                }
                
            }   
        }
    }
}