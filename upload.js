/** @format */

const createUploadthing = require("uploadthing");
const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4mp" } }).onUploadComplete(
    async ({ fiel }) => {
      return { url: file.url };
    }
  ),
};
