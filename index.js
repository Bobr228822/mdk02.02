const fs = require("fs").promises;
const path = require("path");
async function calculateSalesTotal(salesFiles) {
  let salesTotal = 0;
 // loop over each file path in the salesFiles array
  for (file of salesFiles) {
    // read the file and parse the contents as JSON
    const data = JSON.parse(await fs.readFile(file));
    // Add the amount in the data.total field to the salesTotal variable
    salesTotal += data.total;
  }
  return salesTotal;
}

async function main() {
  const salesDir = path.join(__dirname, "stores");
  const salesTotalsDir = path.join(__dirname, "salesTotals");

  // create the salesTotal directory if it doesn't exist
  try {
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  // find paths to all the sales files
  const salesFiles = await findSalesFiles(salesDir);
const salesTotal = await calculateSalesTotal(salesFiles);

  // write the total to the "totals.json" file
  await fs.writeFile(
    path.join(salesTotalsDir, "totals.txt"),
    `${salesTotal}\r\n`,
    { flag: "a" }
  );

  // write the total to the "totals.txt" file
  await fs.writeFile(path.join(salesTotalsDir, "totals.txt"), String());
  console.log(`Wrote sales totals to ${salesTotalsDir}`);
  

}
main();


//const items = await fs.readdir("stores");
//console.log(items); 

//const items = await fs.readdir("stores", { withFileTypes: true });
//for (let item of items) {
//  const type = item.isDirectory() ? "folder" : "file";
//  console.log(`${item.name}: ${type}`);
//}

async function findSalesFiles(folderName) {
  // this array will hold sales files as they are found
  let salesFiles = [];

  async function findFiles(folderName) {
    // read all the items in the current folder
    const items = await fs.readdir(folderName, { withFileTypes: true });

    // iterate over each found item
    for (item of items) {
      if (item.isDirectory()) {
        // search this directory for files (this is recursion!)
        await findFiles(`${folderName}/${item.name}`);
      } else {
        // Make sure the discovered file is a sales.json file
        if (item.name === "sales.json") {
          // store the file path in the salesFiles array
          //salesFiles.push(`${folderName}/${item.name}`);
	   await salesFiles.push(path.join(folderName, item.name));

        }
      }
    }
  }
  // search this directory for files (this is recursion!)
  await findFiles(folderName);
  return salesFiles;
}
