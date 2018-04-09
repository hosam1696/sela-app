export class MyVariabels { 
    public API_URL: string = 'http://localhost/sella/api/';
    public URL: string = 'http://localhost/sella/';

    // public API_URL: string = 'http://localhost/sella/api/';
    // public URL: string = 'http://whatsneeded.net/';

    public EMAIL_REGEXP =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public NUMBER_REGXP=/^\d+$/;
    constructor() {           
    }
}