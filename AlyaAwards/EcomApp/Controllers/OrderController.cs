using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Web.Http.Cors;
using EcomApp.App_Start;

namespace EcomApp.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class OrderController : ApiController
    {
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        [Route("orders/all")]
        [HttpGet]
        public string getOrders(string userId)
        {
            List<dynamic> Orders = new List<dynamic>();
            using (var ctx = new StoreDBEntities())
            {
                var x = from o in ctx.Orders
                        where o.Customer == userId
                        select o;
                Console.WriteLine(x.Count());

                foreach (var i in x)
                {
                    dynamic ord = new
                    {
                        Id = i.Id,
                        Date = i.Date.ToString("yyyy-dd-MM"),
                        Total = i.Total,
                        Shipping = i.Shipping,
                        Taxes = i.Taxes,
                        Card_Number = i.Card_Number,
                        No_of_Item = i.No_of_Item,
                        Customer = i.Customer,
                        address = i.Address
                    };
                    Orders.Add(ord);

                }
            }
            return serializer.Serialize(Orders); ;
        }

        [Route("order/detail")]
        [HttpGet]
        public string getProductDetail(Order ord)
        {
            Order x = new Order();
            using (var ctx = new StoreDBEntities())
            {
                x = (from p in ctx.Orders
                     where p.Id == ord.Id
                     select p).FirstOrDefault();
            }
            return serializer.Serialize(x);
        }

        [Route("order/delete")]
        [HttpPost]
        public string cancelOrder([FromBody] string orderId)
        {
            ResultResponse rr = new ResultResponse();
            using (var ctx = new StoreDBEntities())
            {
                rr.returnCode = 0;
                var x = (from p in ctx.Orders
                         where p.Id == orderId
                         select p).FirstOrDefault();
                if (x != null)
                {
                    try
                    {
                        ctx.Orders.Remove(x);
                        ctx.SaveChanges();
                        rr.returnCode = 1;
                        rr.result = "Order Deleted Successfully!";
                    }
                    catch (Exception e)
                    {
                        rr.result = e.ToString();
                    }
                }
                return serializer.Serialize(rr);

            }
        }

        [Route("order/update")]
        [HttpPost]
        public string updateOrder([FromBody] Order ord)
        {
            ResultResponse rr = new ResultResponse();
            using (var ctx = new StoreDBEntities())
            {
                rr.returnCode = 0;
                var x = (from p in ctx.Orders
                         where p.Id == ord.Id
                         select p).FirstOrDefault();
                if (x != null)
                {
                    x.Id = x.Id;
                    x.Date = x.Date;
                    x.Total = x.Total;
                    x.No_of_Item = x.No_of_Item;
                    x.Customer = x.Customer;
                    try
                    {
                        ctx.SaveChanges();
                        rr.returnCode = 1;
                        rr.result = "Order Updated Successfully!";
                    }
                    catch (Exception e)
                    {
                        rr.result = e.ToString();
                    }
                }
                return serializer.Serialize(rr);

            }
        }

        [Route("order/add")]
        [HttpPost]
        public string addOrder([FromBody] dynamic str)
        {
            string orderId = (Guid.NewGuid()).ToString();
            string [] strs = orderId.Split('-');
            string OrderNo = ("OOG" + strs[4]).ToUpper();
            string result = OrderNo;
            using (var ctx = new StoreDBEntities())
            {
                try
                {
                    Order new_order = new Order
                    {
                        Id = orderId,
                        Total = str.orderTotal,
                        Date = str.date,
                        Card_Number = str.cardNumber,
                        No_of_Item = str.no_of_items,
                        Customer = str.user,
                        Shipping = str.shipCharges,
                        Taxes = str.taxes,
                        OrderNo = OrderNo
                    };
                    if (str.addressId == "")
                    {
                        string addressId = (Guid.NewGuid()).ToString();
                        Address newAddress = new Address
                        {
                            Id = addressId,
                            FullName = str.address.FullName,
                            Address_Line_1 = str.address.Address_Line_1,
                            Address_Line_2 = str.address.Address_Line_2,
                            City = str.address.City,
                            State = str.address.State,
                            Zip = str.address.Zip,
                            Country = str.address.Country,
                            PhoneNumber = str.address.PhoneNumber,
                            Customer = str.user
                        };
                        ctx.Addresses.Add(newAddress);
                        ctx.SaveChanges();
                        new_order.Address = addressId;
                    }
                    else
                    {
                        new_order.Address = str.addressId;
                    }
                    ctx.Orders.Add(new_order);
                    ctx.SaveChanges();
                    string ItemsStr = "";
                    for (int i = 0; i < str.items.Count; i++)
                    {
                        ItemsStr = ItemsStr + "<tr><td>" + str.items[i].Name+ "</td><td>"+ str.items[i].quantity + "</td><td>"+ str.items[i].Price + "</td><td>"+ (str.items[i].quantity * str.items[i].Price) + "</td></tr>";
                        try
                        {
                            ctx.Order_Product.Add(new Order_Product
                            {
                                OrderId = orderId,
                                ProductId = str.items[i].Id,
                                Quantity = str.items[i].quantity
                            });
                            ctx.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            result = ex.ToString();
                        }
                    }
                    string user = str.user;
                    Customer x = (from p in ctx.Customers
                                  where p.UserId == user
                                  select p).FirstOrDefault();
                    string ShippingAddress = "<address>"+
                                                "<br>"+ str.address.FullName + 
                                                "<br>" + str.address.Address_Line_1 + " "+ str.address.Address_Line_2 + "," +
                                                "<br>" + str.address.City + "," +
                                                "<br>" + str.address.State + " - " + str.address.Zip + "," +
                                                "<br>" + str.address.Country + "," + 
                                                "<br> Phone: "+ str.address.PhoneNumber + " <br>" +
                                             "</address>";
                   //send email
                    dynamic orderVar = new {
                        UserName = x.FirstName + ' ' + x.LastName,
                        OrderNo = OrderNo,
                        ItemsStr = ItemsStr,
                        Taxes = str.taxes,
                        Shipping = str.shipCharges,
                        Total = str.orderTotal,
                        ShippingAddress = ShippingAddress
                    };
                    string subj = "Order Confirmation - Your Order with alyaawards.com [" + OrderNo + "] has been successfully placed!";
                    string UserEmail = str.user;
                    Email email = new Email();
                    string eresult = email.SendEmail(orderVar, UserEmail, subj);
                }
                catch (Exception e)
                {
                    result = e.ToString();
                }

            }
            return result;
        }

        [Route("order/items")]
        [HttpGet]
        public string getOrderItems(string orderId)
        {
            List<dynamic> Ps = new List<dynamic>();
            string x = orderId;
            using (var ctx = new StoreDBEntities())
            {
                var y = from o in ctx.Order_Product
                        where o.OrderId == x
                        join p in ctx.Products on o.ProductId equals p.Id
                        select new
                        {
                            PId = p.Id,
                            Name = p.Name,
                            Quantity = o.Quantity,
                            Img = p.Img,
                            Price = p.Price
                        };
                foreach (var i in y)
                {
                    dynamic ps_ = new
                    {
                        Id = i.PId,
                        Name = i.Name,
                        Price = i.Price,
                        Img = i.Img,
                        quantity = i.Quantity
                    };
                    Ps.Add(ps_);
                }
                string result = serializer.Serialize(Ps);
                return result;
            }
        }
    }
}
