const goose = require("mongoose");
exports.connectDatabase = async (URI)=>{
        await goose.connect(URI)
        console.log("successfully connected")
            
}


// connection string: mongodb+srv://bdave5457:adminPassword@mandu-data.ac49f.mongodb.net/?retryWrites=true&w=majority&appName=mandu-data