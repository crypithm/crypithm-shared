import mimeDB from 'mime-db';

export function getMimeFromName(ext:string):string{
    var re = /\.[^.\\/:*?"<>|\r\n]+$/;
    var ext = re.exec(ext)[0];
    ext = ext ? ext.split(".")[1] : ext;
    var Filemime:string="application/octet-stream"
    Object.keys(mimeDB).forEach((value, _) => {
        try {
          if (mimeDB[value]["extensions"].indexOf(ext) != -1) {
            Filemime = value;
          }
        } catch {}
      });
      return Filemime;
}