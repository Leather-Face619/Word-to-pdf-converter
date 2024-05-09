const express = require('express')
const multer = require('multer')
const docxToPdf = require('docx-pdf');
const path = require('path');
var cors = require('cors')
const app = express()
app.use(cors())
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post('/convertFile', upload.single('file'), function (req, res, next) {
    try {
        if (!req.file) {
            return res.status(404).json({ message: 'File not found.'})
        }

        //defining output file path 
        let outputpath = path.join(
            __dirname,
             "files",
             `${req.file.originalname}.pdf`)

        docxToPdf(req.file.path, outputpath, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                     message: 'error converting Docx to pdf', })
            }
            res.download(outputpath,()=>{
                console.log("file downloaded");
            })
            
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error', })
    }
})
app.get('/',(req,res)=>{
    res.send("hello")
})
app.listen(3000)