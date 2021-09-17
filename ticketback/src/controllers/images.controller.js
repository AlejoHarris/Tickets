import Img from '../models/Image'
import { getQuery } from '../libs/getQuery';
import { format } from 'util';

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("tickets-images-challenge");

export const getUrlByTicketId = async (req, res) => {
    const {id} = req.params;
    let images = await getQuery(req.query.limit, req.query.page, id)
    await Img.findAll(images)
        .then(result => {
            result.length != 0 ? res.status(200).json(result.map(val => ({ "url": val.url, "id": val.id }))) : res.status(404).json({ message: "Images not found" })
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })

}

export const deleteUrlByImageId = async (req, res) => {
    const { id } = req.params
    let filename = await Img.findByPk(id)
        .then(result => {
            let url = (result['url']);
            let array = url.split('/');
            let name = array[array.length - 2] + '/' + array[array.length - 1]
            return name;
        })
        .catch((error) => res.status(500).json({ message: 'Image not found', error: error }))
    let deletedFromGCloud = await bucket.file(filename).delete()
        .then(() => true)
        .catch(error => {
            res.status(500).json({ error: error })
        })
    //console.log(deletedFromGCloud)
    if (deletedFromGCloud) {
        await Img.destroy({ where: {id: parseInt(id)} }).
            then(() => {
                res.status(200).json({ message: 'Image deleted sucessfully' })
            })
            .catch((error) => res.status(500).json({ message: 'Image not deleted from DB', error: error }))
    } else {
        res.status(500).json({ message: 'Image not found in GCloud' })
    }
}

export const uploadFiles = async (req, res) => {

    const newImage = Img.build({ ticketId: req.body['ticketId'] });
    await newImage.save()
    await uploadGCP(req, res, newImage.id)
        .then(() => {
            res.status(201).json({ message: "Image uploaded succesfully" })
        })
        .catch(error => res.status(500).json({ error: error }))
}


function defineName(ticketId, imageId) {
    return + ticketId.toString() + '/' + imageId.toString()
}

async function uploadGCP(req, res, id) {

    const ticketId = req.body['ticketId'];
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file!" });
        }
        const filename = defineName(ticketId, id);
        const extension = req.file.originalname.split('.');
        const blob = bucket.file(filename + '.' + extension[extension.length - 1], req.file);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });
        blobStream.on("error", (err) => {
            res.status(500).json({ message: err.message });
        });
        blobStream.on("finish", async () => {
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${filename}.${extension[extension.length - 1]}`
            );
            let newImage = await Img.update({
                url: publicUrl,
                completed: true
            }, {
                where: {
                    id: id
                }
            });
            return newImage;
        });
        blobStream.end(req.file.buffer);
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }
        res.status(500).json({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
}