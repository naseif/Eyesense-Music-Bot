/***
 * PrefixRepository
 *
 * We want to enable our bot to be able to remember custom prefixes for the 
 * prefixed commands using mongodb.
 */
const { Collection: MongoCollection, MongoClient } = require("mongodb");
const { Collection, Fields } = require("quickmongo");

let prefixRepository = function (connectionString) {
    let api = {};
    
    api._connectionString = connectionString;

    const schema = new Fields.ObjectField({
        prefixe: new Fields.ArrayField(new Fields.StringField())
    });

    async function execute(callback) {
        api._mongo = new MongoClient(api._connectionString);
        api._mongo.connect().then(async() => {
            console.log("Connected to the database!");
            try {
                 await callback();
            } catch (error) {
                console.log(error);
            } finally {
                await api._mongo.close();
            }
        });
    }

    api.getPrefixes = async function() {

        return await execute( async() => {
            const mongoCollection = api._mongo.db().collection("JSON");
            const db = new Collection(mongoCollection, schema);

            api.fetchedPrefixes = await db.get("prefixes");
            return api.fetchedPrefixes
        });
    
    }

    api.setPrefixes = async function(prefixes) {
        await execute( async() => {
            console.log("setting prefixes to " + prefixes);

            const mongoCollection = api._mongo.db().collection("JSON");
            const db = new Collection(mongoCollection, schema);
    
            await db.set("prefixes", prefixes); 
            console.log("complete");
            return;
        });
    }

    return api;
};

module.exports = prefixRepository;
