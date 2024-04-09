const express = require("express");
require('dotenv').config();

const app = express();

const linter = require("./dmnlint")
const path = require("path");
const CONFIG_NAME = '.dmnlintrc';

const { promisify } = require('util');

const fs = require('fs');
const readFile = promisify(fs.readFile);


var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


function isEmpty(object) {
    return Object.keys(object).length === 0
}

app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        console.log("Error 400 has Occurred::: ");
        return res.sendStatus(400); // Bad request
    }

    next();
});


app.post('/lint', async (req, res) => {
  
  try {
   // console.log("Data Received::: " + req.body.dmn);
    var dmnXML = new Buffer.from(req.body.dmn).toString();
    const { migrateDiagram } = require('@bpmn-io/dmn-migrate'); 

    const configString = await readFile(CONFIG_NAME, 'utf-8');
    const config = JSON.parse(configString);
    const migratedXML = await migrateDiagram(dmnXML);

      linter.lint(migratedXML, config)
      .then((data) => {
        let categoryValue = null;
        Object.keys(data).map((key, value) => {
          categoryValue = data[key]["0"].category;
        });
        console.log(categoryValue);

        if (categoryValue === null || categoryValue === "") {
                  res.send({ message: "File is valid" });
        } else {
          if (categoryValue?.includes("warning")) {
            //res.send({ "warning": !isEmpty(data), data: data });
          } else if (categoryValue?.includes("error")) {
            res.send({ "errors": !isEmpty(data), data: data });
          } else {
            res.send({ "message": "File is not valid", data: data });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.send("Error Occurred");
      });
  } catch (error) {
    console.log("New ERROR");
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});


app.post("/validateOndeployment", async (req, res) => {

  try {
    const workspaceName = req.body.workspaceName;
    const miniAppName = req.body.miniAppName;

    const dmnFolderPath = `\\if-repo\\${workspaceName}\\${miniAppName}\\src\\main\\resources\\dmn`;



    if (!fs.existsSync(dmnFolderPath)) {
      return res.status(404).send({ message: "DMN folder does not exist" });
    }

    const files = fs.readdirSync(dmnFolderPath);
    const validationResults = [];

    for (const file of files) {
      const dmnFilePath = path.join(dmnFolderPath, file);

      try {
        const dmnXML = fs.readFileSync(dmnFilePath, "utf-8");
        const { migrateDiagram } = require('@bpmn-io/dmn-migrate'); 
    
        const configString = await readFile(CONFIG_NAME, 'utf-8');
        const config = JSON.parse(configString);
        const migratedXML = await migrateDiagram(dmnXML);

        const data = await linter.lint(migratedXML, config);

        let categoryValue = null;
        Object.keys(data).forEach((key) => {
          categoryValue = data[key]["0"].category;
        });
        console.log(categoryValue);

        if (categoryValue === null || categoryValue === "") {
          //validationResults.push({ file, message: "File is valid" });
        } else if (categoryValue.includes("warning")) {
          validationResults.push({file, "warning": !isEmpty(data), data: data });
        } else if (categoryValue.includes("error")) {
          validationResults.push({file, "errors": !isEmpty(data), data: data });
        } else {
          validationResults.push({ file, message: "File is not valid", data });
        }
      } catch (err) {
        console.error("Error validating file:", dmnFolderPath);
        console.error(err);
        validationResults.push({ file, error: err.message });
      }
    }
if(!validationResults.length<=0){
    res.send({ "error": true ,"data":validationResults});
}else{
  res.send({ "error":false });

}
} catch (error) {
  console.error("New ERROR");
  console.error(error);
  res.status(500).send({ message: error.message });
}
});

app.listen(31503, () => {
    console.log("Running at PORT", 31503);
})
