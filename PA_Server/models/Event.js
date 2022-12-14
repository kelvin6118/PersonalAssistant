const db = require('../db.config');


module.exports = class Event {
    constructor(data){
        this.eventid = data.eventid
        this.userid = data.userid;
        this.title = data.title;
        this.description = data.description;
        this.date = data.date;
        this.time = data.time;
    };

    static create(userData){
        return new Promise (async (resolve, reject) => {
            try {
                const { userid, title, description, date, time} = userData;
                let newEvent = await db.query('INSERT INTO events (userid, title, description, date, time) VALUES ($1,$2,$3,$4,$5) RETURNING *;',[userid, title, description, date, time]);
                let result = new Event(newEvent.rows[0]);
                resolve (result);
                
            } catch (err) {
                console.log(err);
                reject('Event could not be created');
            }
        });
    }

    static findByUserId(userID){
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query('SELECT * FROM events WHERE userid = $1;', [ userID ]);
                let events = result.rows.map(e => ({...new Event(e)}));
                resolve(events);
            } catch (err) {
                reject('Events not found!');
            }
        })
    }
};
