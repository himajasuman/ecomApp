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
    public class CustomerController : ApiController
    {
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        [Route("customer/signup")]
        [HttpPost]
        public string customerSignUp([FromBody] Customer aData)
        {
            using (var ctx = new StoreDBEntities())
            {
                Customer x = (from p in ctx.Customers
                           where p.UserId == aData.UserId && p.Password == aData.Password
                           select p).FirstOrDefault();
                var result = "User not found!";
                if (x == null)
                {
                    try
                    {
                        ctx.Customers.Add(aData);
                        ctx.SaveChanges();
                        result = "Signup Successful!";
                    }
                    catch (Exception e)
                    {
                        result = e.ToString();
                    }
                }
                return result;

            }
        }

        [Route("customer/login")]
        [HttpPost]
        public string customerLogin([FromBody] Customer aData)
        {
            using (var ctx = new StoreDBEntities())
            {
                Customer x = (from p in ctx.Customers
                           where p.UserId == aData.UserId && p.Password == aData.Password
                           select p).FirstOrDefault();
                
                if (x != null)
                {
                    Customer c = new Customer()
                    {
                        UserId = x.UserId,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        Password = x.Password,
                        PhoneNumber = x.PhoneNumber
                    };
                    return serializer.Serialize(c);
                }
                else
                {
                    return "User not found!";
                }

            }
        }
    }
}
