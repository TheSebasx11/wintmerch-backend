const express = require("express");
const app = express();
const morgan = require('morgan');
const Cors = require('cors');
const {config} = require("./src/config/config");


//Settings
app.set("port", process.env.PORT || 3000);
app.use(Cors());

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//routes
app.use(require("./src/routes/routes"));

app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});
