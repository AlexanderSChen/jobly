// include expressError assigned to BadRequestError when we receive incomplete data from a request
const { BadRequestError } = require("../expressError");

// Helper for making selective update queries.
/** takes dataToUpdate and jsToSql, which is an object containing the JSON data that needs to be converted to SQL 
 * The calling function can use it to make the SET clause of an SQL UPDATE statement
 * @param dataToUpdate {object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {object} maps js-style data fields to database column names,
 *  like {firstName: "first_name", age: "age"}
 * @returns {Object} {sqlSetCols, dataToUpdate}
 * @example {firstName: 'Aliya', age: 32} => 
 * {setCols: '"first_name"=$1, "age"=$2',
 *  values: ['Aliya', 32]}
*/
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  /** 
   {
    a: 'somestring',
    b: 42,
    c: false
  }; 
  => ["a", "b", "c"] */
  const keys = Object.keys(dataToUpdate);
  // if there is no dataToUpdate then throw an error
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  // map keys data and assign idx reference to turn the JSON object into an array and assign it to cols
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  // return the data as a SQL query to UPDATE
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
