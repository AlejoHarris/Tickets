import Img from "../models/Image";
import Ticket from "../models/Ticket";
import { getQuery } from './getQuery';
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("tickets-images-challenge");

export async function deleteMultiImg(ticketId) {
    let images = await getQuery(100, 1, parseInt(ticketId))
    let imgArray = await Img.findAll(images)
        .then(result => {
            return result.length != 0 ? result.map(val => val['id']) : null
        })
        .catch(error => console.log(error))
    if (imgArray != null) {
        if (imgArray.length > 0) {
            imgArray.forEach(async element => {
                let id = element;
                let filename = await Img.findByPk(id)
                    .then(result => {
                        let url = (result['url']);
                        let array = url.split('/');
                        let name = array[array.length - 2] + '/' + array[array.length - 1]
                        return name;
                    })
                    .catch(error => console.log(error))
                await bucket.file(filename).delete()
                    .catch(error => console.log(error))
                await Img.destroy({ where: { id: parseInt(id) } })
                    .catch(error => console.log(error))
            })
            deleteMultiImg(ticketId);
        }
    }
    let ticket = await Ticket.findByPk(ticketId)
    ticket.destroy().catch(error => console.log(error));

}