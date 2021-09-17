import { Op } from "sequelize";

export async function getQuery(limit, page, ticketId, state, dateStart, dateEnd, userId) {
    const where = {}
    limit != undefined ? limit = parseInt(limit) : limit = 10
    page != undefined ? page = parseInt(page) : page = 1;
    state != undefined ? where['state'] = state : null;
    if (dateStart != undefined && dateEnd != undefined) {
        where['createdAt'] = {
            [Op.gte]: Date.parse(dateStart),
            [Op.lte]: Date.parse(dateEnd)
        }
    }
    const obj = {
        limit: limit,
        offset: (page - 1) * limit,
        where: where
    }
    userId != undefined ? where['usernameId'] = userId : null;
    ticketId != undefined ? where['ticketId'] = ticketId : null;
    return obj
}