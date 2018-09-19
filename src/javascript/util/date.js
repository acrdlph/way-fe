import moment from 'moment';

const returnDate = at => moment(new Date(at)).fromNow();

export default returnDate;
