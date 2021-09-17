import Ticket from "../models/Ticket"
import Img from "../models/Image";
import { deleteMultiImg } from "../libs/deleteMultiImg";
import { getQuery } from "../libs/getQuery";

export const createTicket = async (req, res) => {
    const usernameId = req.userId;
    const {title, comment} = req.body;
    const newTicket = Ticket.build({ usernameId, title, comment });
    await newTicket.save()
        .then(ticket => {
            res.status(201).json(ticket)
        })
        .catch(error => {
            res.status(500).json({ error: error })
        });
}

export const getTickets = async (req, res) => {
    let ticket = await getQuery(req.query.limit, req.query.page, undefined, req.query.state, req.query.dateStart, req.query.dateEnd)
        .then(result => result)
    let tickets = await Ticket.findAll(ticket)
        .then(result => {
            if (result.length != 0) {
                return result
            } else {
                res.status(404).json({ message: "Tickets not found" })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })
    let checkStatus = tickets.map(async (element) => {
        return new Promise(async (resolve) => {
            await verifyStatus(element, resolve);
        })
    })
    Promise.all(checkStatus).then(res.status(200).json(tickets))

}

export const getTicketByUserId = async (req, res) => {
    const id = req.userId 
    console.log(id)
    let ticket = await getQuery(req.query.limit, req.query.page, undefined, req.query.state, req.query.dateStart, req.query.dateEnd, id)
    let tickets = await Ticket.findAll(ticket)
        .then(result => {
            if (result.length != 0) {
                return result
            } else {
                res.status(404).json({ message: "Ticket not found" })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })
    let checkStatus = tickets.map(async (element) => {
        return new Promise(async (resolve) => {
            await verifyStatus(element, resolve);
        })
    })
    Promise.all(checkStatus).then(res.status(200).json(tickets))
}

export const getTicketByTicketId = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    await Ticket.findByPk(id)
        .then(result => result['usernameId'] == userId? res.status(200).json(result) : res.status(500).json({message: 'Unauthorized'}))
        .catch((error) => res.status(500).json({ message: 'Ticket not found', error: error }))
}

export const deleteTicketById = (req, res) => {
    const { id } = req.params;
    deleteMultiImg(id)
        .then(() => res.status(200).json({ message: 'Ticket Deleted' }))
        .catch(error => res.status(500).json({ error: error }))
}

async function verifyStatus(ticket, resolve) {
    let images = await getQuery(undefined, undefined, ticket['id'])
    let status = await Img.findAll(images)
        .then(async result => {
            let completed = false;
            if (result.length != 0) {
                let array = result.map(val => val.completed);
                completed = array.every(val => val == 1);
            }
            ticket.state = completed;
            await ticket.save();
        })
        .catch(() => false)
    resolve(status)
}