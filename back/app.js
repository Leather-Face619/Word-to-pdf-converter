const express = require('express')
const multer = require('multer')
var docxToPdf = require('docx-pdf');
const path = require('path');
const app = express()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalName)
    }
})

const upload = multer({ storage: storage })

app.post('/convertfile', upload.single('file'), function (req, res, next) {
    try {
        if (!req.file) {
            return res.status(404).json({ message: 'File not found' })
        }
        let outputpath = path.join(__dirname, "files",`${req.file.originalName}.pdf`)
        docxToPdf(req.file.path, outputpath, function (err, result) {
            if (err) {
                return res.status(500).json({ message: 'Something went wrong' })
            }
            res.download(outputpath,()=>{
                console.log("file downloaded");
            })
           
        });
    } catch (error) {
        console.log(error.message);
    }
})
app.listen(3000)