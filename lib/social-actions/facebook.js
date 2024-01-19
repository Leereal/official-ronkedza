//=====NODE EXAMPLE=====//

//GET ONLY USER'S NAME AND ID
/*https://graph.facebook.com/v18.0/me?access_token=ACCESS-TOKEN*/

//=====EDGES EXAMPLES===//

//GET USER ID, NAME, EMAIL and PICTURE
/*https://graph.facebook.com/v18.0/USER-ID?fields=id,name,email,picture&access_token=ACCESS-TOKEN
{
    "id": "USER-ID",
    "name": "EXAMPLE NAME",
    "email": "EXAMPLE@EMAIL.COM",
    "picture": {
      "data": {
        "height": 50,
        "is_silhouette": false,
        "url": "URL-FOR-USER-PROFILE-PICTURE",
        "width": 50
      }
    }
  }*/

//GET USER LIST OF PHOTOS
/*https://graph.facebook.com/v18.0/USER-ID/photos?access_token=ACCESS-TOKEN
    {
  "data": [
    {
      "created_time": "2017-06-06T18:04:10+0000",
      "id": "1353272134728652"
    },
    {
      "created_time": "2017-06-06T18:01:13+0000",
      "id": "1353269908062208"
    }
  ],
}*/

//=====FIELDS EXAMPLES=====//
//Fields limit what you want to be returned

/*https://graph.facebook.com/v18.0/USER-ID?fields=id,name,email,picture&access_token=ACCESS-TOKEN
{
  "id": "USER-ID",
  "name": "EXAMPLE NAME",
  "email": "EXAMPLE@EMAIL.COM",
  "picture": {
    "data": {
      "height": 50,
      "is_silhouette": false,
      "url": "URL-FOR-USER-PROFILE-PICTURE",
      "width": 50
    }
  }
}
*/

//PUBLISHING TO PAGE
//After publishing you can also get other fields than the default ID only by including the fields list

//Method must be POST
/*https://graph.facebook.com/v18.0/PAGE-ID/feed?message=Hello&fields=created_time,from,id,message&access_token=ACCESS-TOKEN
{
  "created_time": "2017-04-06T22:04:21+0000",
  "from": {
    "name": "My Facebook Page",
    "id": "PAGE-ID"
  },
  "id": "POST_ID",
  "message": "Hello",
}
*/

//DELETE POST OR PHOTO NODE
//Method must be DELETE
/*https://graph.facebook.com/PHOTO-ID?access_token=ACCESSS-TOKEN*/
//Usually you can only delete nodes that you created, but check each node's reference guide to see requirements for delete operations.

//Handling error - https://developers.facebook.com/docs/graph-api/guides/error-handling
//Pages API - https://developers.facebook.com/docs/pages-api
//Graph API References - https://developers.facebook.com/docs/graph-api/reference/
//Webhooks for notifications - https://developers.facebook.com/docs/graph-api/webhooks
//Versioning - https://developers.facebook.com/docs/graph-api/guides/versioning
//Various APIs, SDKs and Platforms - https://developers.facebook.com/docs#apis-and-sdks
