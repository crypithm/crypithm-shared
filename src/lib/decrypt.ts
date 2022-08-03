const apiBaseURL = "https://crypithm.com/api";

import { encode, decode } from "base64-arraybuffer";
import { decode as decodeURLb64 } from "url-safe-base64";

export async function documentLoaded(pathname: string): Promise<object> {
  var Form = new FormData();
  var dec = new TextDecoder();
  Form.append("id", pathname.split("/")[1]);
  var resp = await fetch(`${apiBaseURL}/viewshared`, {
    method: "POST",
    body: Form,
  });

  var jsn = await resp.json();
  var returnData = {};
  var nameBinary = decode(jsn.Name);
  var fileKeyBinary = decode(jsn.Key);
  var keyBinary = decode(decodeURLb64(pathname.split("/")[2]));
  var key = await crypto.subtle.importKey(
    "raw",
    keyBinary,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  returnData["Name"] = dec.decode(
    await decryptBlob(
      key,
      new Uint8Array(nameBinary.slice(0, 16)),
      new Uint8Array(nameBinary.slice(16))
    )
  );
  returnData["Key"] =
    encode(await decryptBlob(
      key,
      new Uint8Array(fileKeyBinary.slice(0, 16)),
      new Uint8Array(fileKeyBinary.slice(16))
    ))
  returnData["Token"] = jsn.Token;
  returnData["Size"] = jsn.Size;
  returnData["Username"] = jsn.Username;
  return returnData;
}

function calchunk(filelength:number):number {
    var chunkcount:number;
    chunkcount = Math.floor(filelength / (1024 * 1024 * 5));
    if (filelength % (1024 * 1024 * 5) > 0) {
      chunkcount = chunkcount + 1;
    }
    return chunkcount;
  }

export async function getFileBlob(Filemime:string, fileDetailJSON:object) {

    var WillusedfileKey = await crypto.subtle.importKey(
        "raw",
        decode(fileDetailJSON["Key"]),
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );
    var hmc = calchunk(fileDetailJSON["Size"]);
  
    var totalBlobList:Blob[]=[]
    var intArr :number[]= [0, 1, 2, 3, 4];
    var loops:number = Math.floor(hmc / 5) + (hmc % 5 == 0 ? 0 : 1);
    for (var i = 0; i < loops; i++) {
      const promises = intArr.map(async (v) =>
        sendAndDownloadData(
          fileDetailJSON["Token"],
          5242912 * (5 * i + v),
          5242912 * (5 * i + v + 1),
          WillusedfileKey,
          fileDetailJSON["Size"]
        ).then((decData) => {
          var respAb = new Uint8Array(decData);
          totalBlobList[5 * i + v] = new Blob([respAb]);
        })
      );
        
      await Promise.all(promises);
    }
    var q = new Blob(totalBlobList, {
        type: Filemime ? Filemime : "application/octet-stream",
      });
      return URL.createObjectURL(q)
}
    function sendAndDownloadData(
        token:string,
        startrange:number,
        endrange:number,
        fileKey:CryptoKey,
        fileSize:number
      ):Promise<Uint8Array> {
        return new Promise((resolve) => {
          if (startrange > fileSize) {
            resolve(new Uint8Array())
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${apiBaseURL}/download`);
            xhr.responseType = "arraybuffer";
            var form = new FormData();
            form.append("token", token);
            xhr.setRequestHeader("StartRange", startrange.toString() );
            xhr.setRequestHeader("EndRange", endrange.toString() );
            xhr.onprogress = (e) => {};
            xhr.onloadend = async () => {
              var data = await decryptBlob(
                fileKey,
                xhr.response.slice(0, 16),
                xhr.response.slice(16)
              );
              resolve(data);
            };
            xhr.send(form);
          }
        });
      }
async function decryptBlob(
  k: CryptoKey,
  iv: Uint8Array,
  data: Uint8Array
): Promise<Uint8Array> {
    try{
        return await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, k, data);
    }catch(e){
        console.error(e)
        return Promise.reject(e)
    }
}
