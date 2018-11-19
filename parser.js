const csv = require('csv')

const TICKET_FIELDS_COLUMN_FROM = 'IP'
const TICKET_FIELDS_COLUMN_TO = 'Address 1'
const TICKET_NAMEPART_REMOVE = 'Quantity'

const getTicketNames = function (obj) {
        let keys = Object.keys(obj);
        let start = keys.indexOf(TICKET_FIELDS_COLUMN_FROM)
        let end = keys.indexOf(TICKET_FIELDS_COLUMN_TO)
        let ticketColumns = keys.filter((key, index) => index > start && index < end)
        return ticketColumns
}

const getTickets = function (ticketColumns, order) {
     let collectedTickets = ticketColumns.reduce((tickets, ticket) => {

        if (order[ticket]) {
            tickets += `${order[ticket]} x ${ticket.replace(' ' + TICKET_NAMEPART_REMOVE, '')} ` + "\n"
        }

        return tickets
     }, '')
     order['Tickets'] = collectedTickets

    ticketColumns.forEach((ticket) => {
        delete order[ticket]
    })

    return order
}

module.exports = async function (data) {

	return new Promise((resolve, reject) => {
		csv.parse(data, {columns: true}, (err, csvData) => {

			if (err) return reject(err)

			let ticketColumns = getTicketNames(csvData[0])
			let dataWithTickets = csvData.map(getTickets.bind(null, ticketColumns))
	
			csv.stringify(
				dataWithTickets,
				{
					header: true
				},
				(err, result) => {
					if (err) return reject(err);

					resolve(result)
				}
			)
		})
	})


}