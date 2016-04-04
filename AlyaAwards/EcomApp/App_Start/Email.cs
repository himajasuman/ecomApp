using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Configuration;
using System.IO;

namespace EcomApp.App_Start
{
    public class Email
    {
        public string SendEmail(dynamic orderVar, string userId, string subj)
        {
            string body = string.Empty;
            using (StreamReader reader = new StreamReader(System.Web.HttpContext.Current.Request.MapPath("~/App_Start/EmailTemplate.html")))
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{UserName}", orderVar.UserName);
            body = body.Replace("{orderNumber}", orderVar.OrderNo);
            body = body.Replace("{Orders}", orderVar.ItemsStr);
            body = body.Replace("{taxes}", orderVar.Taxes.ToString());
            body = body.Replace("{shipping}", orderVar.Shipping.ToString());
            body = body.Replace("{grandTotal}", orderVar.Total.ToString());
            body = body.Replace("{ShippingAddress}", orderVar.ShippingAddress);
            this.SendHtmlFormattedEmail(userId, subj, body);
            return "success";
        }

        private void SendHtmlFormattedEmail(string recepientEmail, string subject, string body)
        {
            using (MailMessage mailMessage = new MailMessage())
            {
                mailMessage.From = new MailAddress(ConfigurationManager.AppSettings["UserName"]);
                mailMessage.Subject = subject;
                mailMessage.Body = body;
                mailMessage.IsBodyHtml = true;
                mailMessage.To.Add(new MailAddress(recepientEmail));
                SmtpClient smtp = new SmtpClient();
                smtp.Host = ConfigurationManager.AppSettings["Host"];
                smtp.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
                System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();
                NetworkCred.UserName = ConfigurationManager.AppSettings["UserName"];
                NetworkCred.Password = ConfigurationManager.AppSettings["Password"];
                smtp.UseDefaultCredentials = true;
                smtp.Credentials = NetworkCred;
                smtp.Port = int.Parse(ConfigurationManager.AppSettings["Port"]);
                smtp.Send(mailMessage);
            }
        }


    }
}