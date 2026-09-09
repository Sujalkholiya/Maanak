const imagekit = require("@imagekit/nodejs");

const imagekitClient = new imagekit({
    publicKey: process.env.PUBLIC_IMAGEKIT_KEY,
    privateKey: process.env.PRIVATE_IMAGEKIT_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFiles(buffer, fileName = "Image") {
    const result = await imagekitClient.files.upload({
        file: buffer.toString("base64"),
        fileName: fileName,
        folder: "Image"
    });
    return result;
}

module.exports = { uploadFiles };
