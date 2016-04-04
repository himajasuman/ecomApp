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
    public class ProductController : ApiController
    {
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        [Route("products/all")]
        [HttpGet]
        public string getProducts()
        {
            List<Product> Products = new List<Product>();
            using (var ctx = new StoreDBEntities())
            {
                var x = from p in ctx.Products
                        select p;
                foreach(var i in x)
                {
                    Products.Add(new Product {
                        Id = i.Id,
                        Name = i.Name,
                        Description = i.Description,
                        Img = i.Img,
                        Price = i.Price,
                        Stock = i.Stock,
                        Category = i.Category
                    });
                }
            }
            return serializer.Serialize(Products); ;
        }

        [Route("products/detail")]
        [HttpPost]
        public string getProductDetail([FromBody] string prodId)
        {
            using (var ctx = new StoreDBEntities())
            {
                var prod = (from p in ctx.Products
                    where p.Id == prodId.ToString()
                     select p).FirstOrDefault();
                Product x = new Product(){
                    Id = prod.Id,
                    Name = prod.Name,
                    Description = prod.Description,
                    Category = prod.Category,
                    Img = prod.Img,
                    Stock = prod.Stock,
                    Price = prod.Price
                };
                return serializer.Serialize(x);
            }
           
        }

        [Route("products/add")]
        [HttpPost]
        public string addProduct([FromBody] Product prod)
        {
            ResultResponse rr = new ResultResponse();
            using (var ctx = new StoreDBEntities())
            {
                prod.Id = (Guid.NewGuid()).ToString();
                rr.returnCode = 0;
                try
                {
                    ctx.Products.Add(prod);
                    ctx.SaveChanges();
                    rr.returnCode = 1;
                    rr.result = "Product Added Successfully!";
                }
                catch (Exception e)
                {
                    rr.result = e.ToString();
                }
                return serializer.Serialize(rr);

            }
        }

        [Route("products/delete")]
        [HttpPost]
        public string deleteProduct([FromBody] dynamic prod)
        {
            ResultResponse rr = new ResultResponse();
            string pid = prod.prodId.ToString();
            using (var ctx = new StoreDBEntities())
            {
                rr.returnCode = 0;
                var x = (from p in ctx.Products
                     where p.Id == pid
                         select p).FirstOrDefault();
                if(x != null)
                {
                    try
                    {
                        ctx.Products.Remove(x);
                        ctx.SaveChanges();
                        rr.returnCode = 1;
                        rr.result = "Product Deleted Successfully!";
                    }
                    catch (Exception e)
                    {
                        rr.result = e.ToString();
                    }
                }
                return serializer.Serialize(rr);

            }
        }

        [Route("products/update")]
        [HttpPost]
        public string updateProduct([FromBody] Product prod)
        {
            ResultResponse rr = new ResultResponse();
            using (var ctx = new StoreDBEntities())
            {
                rr.returnCode = 0;
                var x = (from p in ctx.Products
                         where p.Id == prod.Id
                         select p).FirstOrDefault();
                if (x != null)
                {
                    x.Name = prod.Name;
                    x.Description = prod.Description;
                    x.Img = prod.Img;
                    x.Price = prod.Price;
                    x.Stock = prod.Stock;
                    x.Category = prod.Category;
                    try
                    {
                        ctx.SaveChanges();
                        rr.returnCode = 1;
                        rr.result = "Product Updated Successfully!";
                    }
                    catch (Exception e)
                    {
                        rr.result = e.ToString();
                    }
                }
                return serializer.Serialize(rr);

            }
        }
    }
}
