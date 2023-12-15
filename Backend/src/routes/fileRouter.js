const express = require('express');
const fileRouter = express.Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');


fileRouter.use(fileUpload());

fileRouter.post('/upload', (req, res) => {
    try {
        const rawFile = req.files.file;

        //pdf-lib uses zero index, so converting pageOrder to the same
        var pageOrder = JSON.parse(req.body.pageOrder);
        pageOrder = pageOrder.map(el => el - 1);

        fs.writeFile('./raw-pdfs/' + rawFile.name, rawFile.data, async (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('File saved successfully!');

                // Creates new pdf using pageOrder and existing pdf
                const pdfDoc = await PDFDocument.create()
                const rawPdfDoc = await PDFDocument.load(rawFile.data)
                const pages = await pdfDoc.copyPages(rawPdfDoc, [...pageOrder])
                pages.map(page => {

                    pdfDoc.addPage(page)
                })
                const pdfBytes = await pdfDoc.save()

                //Saves new pdf
                const fileName = Date.now().toString() + '.pdf'
                fs.writeFile('./edited-pdfs/' + fileName, pdfBytes, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    } else {
                        console.log('File saved successfully!');
                        res.status(200).send({ file: fileName });
                    }
                });

            }
        });
    }
    catch (err) {
        console.log(err);
    }
});

fileRouter.get('/download/:fileName', (req, res) => {
    try {

        const fileName = req.params.fileName;
        const options = {
            root: "./edited-pdfs/",
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        }
        res.sendFile(fileName, options);
    }
    catch (err) {
        console.log(err);
    }

});




module.exports = fileRouter;