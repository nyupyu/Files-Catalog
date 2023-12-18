import DIR_DATA from "./dirData.json" assert { type: "json" };
const CATALOG = document.getElementById("catalog");

function fileCatalog() {
  function checkData(a) {
    const checkDataArray = a;
    for (const element of a) {
      !element
        ? console.log(`ERROR: ${element} not found`)
        : console.log(`${element} is successfully loaded`);
    }
  }

  checkData([DIR_DATA, CATALOG]);
}

fileCatalog();
