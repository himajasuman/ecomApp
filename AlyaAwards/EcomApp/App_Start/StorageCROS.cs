using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Shared.Protocol;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EcomApp.App_Start
{
    public class StorageCROS
    {
        public static void AddCorsRuleStorageClientLibrary()
        {
            //Add a new rule.
            var corsRule = new CorsRule()
            {
                AllowedHeaders = new List<string> { "x-ms-*", "content-type", "accept" },
                AllowedMethods = CorsHttpMethods.Put,//Since we'll only be calling Put Blob, let's just allow PUT verb
                AllowedOrigins = new List<string> { "*" },//This is the URL of our application.
                MaxAgeInSeconds = 1 * 60 * 60,//Let the browswer cache it for an hour
            };

            //First get the service properties from storage to ensure we're not adding the same CORS rule again.
            var storageAccount = new CloudStorageAccount(new StorageCredentials("aawards", "wYCTPw0Ote1mrmfyiPxB6W8OCo+OH1lsAQa82lrKYWKtzTttflaj4znaZn/u8/PyouKaBnW1pH7ogj7yfX+n1w=="), true);
            var client = storageAccount.CreateCloudBlobClient();
            
            var serviceProperties = client.GetServiceProperties();
            var corsSettings = serviceProperties.Cors;

            corsSettings.CorsRules.Add(corsRule);
            //Save the rule
            client.SetServiceProperties(serviceProperties);

            //CloudBlobContainer container = client.GetContainerReference("ghroubboutique");
            //container.CreateIfNotExists();
            //string containersas = GetContainerSasUri(container);
            //Console.WriteLine(containersas);
        }
        static string GetContainerSasUri(CloudBlobContainer container)
        {
            //Set the expiry time and permissions for the container.
            //In this case no start time is specified, so the shared access signature becomes valid immediately.
            SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();
            sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24);
            sasConstraints.Permissions = SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.List;

            //Generate the shared access signature on the container, setting the constraints directly on the signature.
            string sasContainerToken = container.GetSharedAccessSignature(sasConstraints);

            //Return the URI string for the container, including the SAS token.
            return container.Uri + sasContainerToken;
        }
    }
}